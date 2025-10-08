import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entities/bank.entity';
import {
  PaymentTransaction,
  TransactionType,
  TransactionStatus,
} from '../entities/payment-transaction.entity';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { Admin } from '../entities/admin.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  BankResponseDto,
  PaymentTransactionResponseDto,
} from './dto/payment-response.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    @InjectRepository(PaymentTransaction)
    private transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getActiveBanks(): Promise<BankResponseDto[]> {
    const banks = await this.bankRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    return banks.map(
      (bank) =>
        new BankResponseDto({
          id: bank.id,
          name: bank.name,
          name_en: bank.nameEn,
          logo_url: bank.logoUrl,
          card_number: bank.cardNumber,
          account_number: bank.accountNumber,
          recipient_name: bank.recipientName,
          recipient_inn: bank.recipientInn,
          bank_bik: bank.bankBik,
          bank_name: bank.bankName,
          bank_address: bank.bankAddress,
          payment_instructions_ru: bank.paymentInstructionsRu,
          payment_instructions_en: bank.paymentInstructionsEn,
          payment_steps_ru: bank.paymentStepsRu,
          payment_steps_en: bank.paymentStepsEn,
          screenshot_urls: bank.screenshotUrls,
          prepayment_percent: bank.prepaymentPercent,
          payment_timeout_minutes: bank.paymentTimeoutMinutes,
          is_active: bank.isActive,
          sort_order: bank.sortOrder,
          created_at: bank.createdAt,
          updated_at: bank.updatedAt,
        }),
    );
  }

  async getBank(bankId: number): Promise<BankResponseDto> {
    const bank = await this.bankRepository.findOne({
      where: { id: bankId, isActive: true },
    });

    if (!bank) {
      throw new NotFoundException('Банк не найден');
    }

    return new BankResponseDto({
      id: bank.id,
      name: bank.name,
      name_en: bank.nameEn,
      logo_url: bank.logoUrl,
      card_number: bank.cardNumber,
      recipient_name: bank.recipientName,
      payment_instructions_ru: bank.paymentInstructionsRu,
      payment_instructions_en: bank.paymentInstructionsEn,
      sort_order: bank.sortOrder,
    });
  }

  async createPaymentTransaction(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentTransactionResponseDto> {
    // Проверяем заказ
    const order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.order_id },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new ConflictException('Заказ не ожидает оплаты');
    }

    // Проверяем срок оплаты
    if (order.paymentDeadline && order.paymentDeadline < new Date()) {
      throw new BadRequestException('Срок оплаты истек');
    }

    // Проверяем банк
    const bank = await this.bankRepository.findOne({
      where: { id: createPaymentDto.bank_id, isActive: true },
    });

    if (!bank) {
      throw new NotFoundException('Банк не найден');
    }

    // Проверяем, нет ли уже pending транзакции для этого заказа
    const existingTransaction = await this.transactionRepository.findOne({
      where: {
        order: { id: createPaymentDto.order_id },
        status: TransactionStatus.PENDING,
      },
    });

    if (existingTransaction) {
      throw new ConflictException(
        'Для этого заказа уже есть ожидающая проверки транзакция',
      );
    }

    // Создаем транзакцию
    const transaction = this.transactionRepository.create({
      order,
      bank,
      transactionType: TransactionType.PREPAYMENT,
      amount: order.prepaidAmount,
      status: TransactionStatus.PENDING,
      receiptImageUrl: createPaymentDto.receipt_image_url,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.buildTransactionResponse(savedTransaction, bank);
  }

  async getOrderTransactions(
    orderId: number,
  ): Promise<PaymentTransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { order: { id: orderId } },
      relations: ['bank'],
      order: { createdAt: 'DESC' },
    });

    return transactions.map((transaction) =>
      this.buildTransactionResponse(transaction, transaction.bank),
    );
  }

  async getActiveOrderTransaction(
    orderId: number,
  ): Promise<PaymentTransactionResponseDto | null> {
    const transaction = await this.transactionRepository.findOne({
      where: { 
        order: { id: orderId },
        status: TransactionStatus.PENDING,
      },
      relations: ['bank', 'order'],
    });

    if (!transaction) {
      return null;
    }

    // Проверяем, не истекла ли транзакция
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (transaction.createdAt < thirtyMinutesAgo) {
      console.log(`PaymentService: Старая PENDING транзакция ${transaction.id} обновлена на EXPIRED`);
      transaction.status = TransactionStatus.EXPIRED;
      await this.transactionRepository.save(transaction);
      return null;
    }

    return this.buildTransactionResponse(transaction, transaction.bank);
  }

  async confirmPayment(
    transactionId: number,
    adminId: number,
    adminNotes?: string,
  ): Promise<PaymentTransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['order', 'bank'],
    });

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new ConflictException('Транзакция уже обработана');
    }

    // Обновляем транзакцию
    transaction.status = TransactionStatus.CONFIRMED;
    transaction.confirmedBy = { id: adminId } as Admin;
    transaction.confirmedAt = new Date();
    transaction.adminNotes = adminNotes || '';

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Обновляем заказ
    const order = transaction.order;
    order.status = OrderStatus.PAYMENT_CONFIRMED;
    order.paymentStatus = PaymentStatus.PREPAID;

    await this.orderRepository.save(order);

    return this.buildTransactionResponse(savedTransaction, transaction.bank);
  }

  async rejectPayment(
    transactionId: number,
    adminId: number,
    adminNotes: string,
  ): Promise<PaymentTransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['order', 'bank'],
    });

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new ConflictException('Транзакция уже обработана');
    }

    // Обновляем транзакцию
    transaction.status = TransactionStatus.REJECTED;
    transaction.confirmedBy = { id: adminId } as Admin;
    transaction.confirmedAt = new Date();
    transaction.adminNotes = adminNotes;

    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.buildTransactionResponse(savedTransaction, transaction.bank);
  }

  async getPendingTransactions(): Promise<PaymentTransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { status: TransactionStatus.PENDING },
      relations: ['bank', 'order'],
      order: { createdAt: 'ASC' },
    });

    return transactions.map((transaction) =>
      this.buildTransactionResponse(transaction, transaction.bank),
    );
  }

  async uploadReceipt(
    transactionId: number,
    receiptImageUrl: string,
  ): Promise<PaymentTransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['bank', 'order'],
    });

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new ConflictException('Транзакция уже обработана');
    }

    // Обновляем транзакцию с URL чека
    transaction.receiptImageUrl = receiptImageUrl;
    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.buildTransactionResponse(savedTransaction, transaction.bank);
  }

  async uploadReceiptBase64(
    transactionId: number,
    base64Image: string,
    fileExtension: string,
  ): Promise<PaymentTransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['bank', 'order'],
    });

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new ConflictException('Транзакция уже обработана');
    }

    // Валидация расширения файла
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      throw new BadRequestException('Неподдерживаемый формат файла. Разрешены: jpg, jpeg, png, gif');
    }

    // Валидация base64 данных
    if (!base64Image || base64Image.trim() === '') {
      throw new BadRequestException('Base64 данные не могут быть пустыми');
    }

    // Убираем data:image/...;base64, префикс если есть
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Проверяем, что это валидный base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleanBase64)) {
      throw new BadRequestException('Некорректные base64 данные');
    }

    // Обновляем транзакцию с base64 данными чека
    transaction.receiptImageBase64 = cleanBase64;
    transaction.receiptImageUrl = null; // Очищаем URL, так как теперь используем base64
    const savedTransaction = await this.transactionRepository.save(transaction);

    return this.buildTransactionResponse(savedTransaction, transaction.bank);
  }

  private buildTransactionResponse(
    transaction: PaymentTransaction,
    bank: Bank,
  ): PaymentTransactionResponseDto {
    return new PaymentTransactionResponseDto({
      id: transaction.id,
      order_id: transaction.order.id,
      bank: new BankResponseDto({
        id: bank.id,
        name: bank.name,
        name_en: bank.nameEn,
        logo_url: bank.logoUrl,
        card_number: bank.cardNumber,
        recipient_name: bank.recipientName,
        payment_instructions_ru: bank.paymentInstructionsRu,
        payment_instructions_en: bank.paymentInstructionsEn,
        sort_order: bank.sortOrder,
      }),
      transaction_type: transaction.transactionType,
      amount: transaction.amount,
      status: transaction.status,
      receipt_image_url: transaction.receiptImageUrl,
      receipt_image_base64: transaction.receiptImageBase64,
      admin_notes: transaction.adminNotes,
      confirmed_at: transaction.confirmedAt,
      created_at: transaction.createdAt,
      updated_at: transaction.updatedAt,
    });
  }
}
