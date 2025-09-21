import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import {
  BonusTransaction,
  BonusTransactionType,
} from '../entities/bonus-transaction.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import {
  BonusTransactionResponseDto,
  BonusBalanceResponseDto,
} from './dto/bonus-response.dto';
import { UseBonusDto } from './dto/use-bonus.dto';

@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(BonusTransaction)
    private bonusRepository: Repository<BonusTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Начислить бонусы
  async earnBonus(
    userId: number,
    amount: number,
    orderId?: number,
    descriptionRu?: string,
    descriptionEn?: string,
    expiresInDays: number = 365,
  ): Promise<BonusTransactionResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    let order;
    if (orderId) {
      order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const transaction = this.bonusRepository.create({
      user,
      transactionType: BonusTransactionType.EARNED,
      amount,
      order,
      descriptionRu: descriptionRu || `Начислено ${amount} бонусов`,
      descriptionEn: descriptionEn || `Earned ${amount} bonus points`,
      expiresAt: expiresAt,
    });

    const savedTransaction = await this.bonusRepository.save(transaction);

    return new BonusTransactionResponseDto({
      id: savedTransaction.id,
      transaction_type: savedTransaction.transactionType,
      amount: savedTransaction.amount,
      order_id: order?.id,
      description_ru: savedTransaction.descriptionRu,
      description_en: savedTransaction.descriptionEn,
      expires_at: savedTransaction.expiresAt,
      created_at: savedTransaction.createdAt,
    });
  }

  // Списать бонусы
  async spendBonus(
    useBonusDto: UseBonusDto,
  ): Promise<BonusTransactionResponseDto> {
    const { user_id, amount, order_id, description_ru, description_en } =
      useBonusDto;

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем баланс
    const balance = await this.getUserBalance(user_id);
    if (balance.current_balance < amount) {
      throw new BadRequestException('Недостаточно бонусов на счету');
    }

    let order;
    if (order_id) {
      order = await this.orderRepository.findOne({ where: { id: order_id } });
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }
    }

    const transaction = this.bonusRepository.create({
      user,
      transactionType: BonusTransactionType.SPENT,
      amount,
      order,
      descriptionRu: description_ru || `Списано ${amount} бонусов`,
      descriptionEn: description_en || `Spent ${amount} bonus points`,
    });

    const savedTransaction = await this.bonusRepository.save(transaction);

    return new BonusTransactionResponseDto({
      id: savedTransaction.id,
      transaction_type: savedTransaction.transactionType,
      amount: savedTransaction.amount,
      order_id: order?.id,
      description_ru: savedTransaction.descriptionRu,
      description_en: savedTransaction.descriptionEn,
      expires_at: savedTransaction.expiresAt,
      created_at: savedTransaction.createdAt,
    });
  }

  // Получить баланс пользователя
  async getUserBalance(userId: number): Promise<BonusBalanceResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Сначала списываем просроченные бонусы
    await this.expireOldBonus(userId);

    const transactions = await this.bonusRepository.find({
      where: { user: { id: userId } },
    });

    const totalEarned = transactions
      .filter((t) => t.transactionType === BonusTransactionType.EARNED)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter((t) => t.transactionType === BonusTransactionType.SPENT)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpired = transactions
      .filter((t) => t.transactionType === BonusTransactionType.EXPIRED)
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalEarned - totalSpent - totalExpired;

    // Бонусы, которые истекают в течение 30 дней
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoon = await this.bonusRepository
      .createQueryBuilder('bonus')
      .where('bonus.user_id = :userId', { userId })
      .andWhere('bonus.transactionType = :type', {
        type: BonusTransactionType.EARNED,
      })
      .andWhere('bonus.expiresAt <= :date', { date: thirtyDaysFromNow })
      .andWhere('bonus.expiresAt > NOW()')
      .getMany();

    const expiringSoonAmount = expiringSoon.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    return new BonusBalanceResponseDto({
      user_id: userId,
      total_earned: totalEarned,
      total_spent: totalSpent,
      total_expired: totalExpired,
      current_balance: currentBalance,
      expiring_soon: expiringSoonAmount,
    });
  }

  // История бонусных операций
  async getUserTransactions(
    userId: number,
  ): Promise<BonusTransactionResponseDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const transactions = await this.bonusRepository.find({
      where: { user: { id: userId } },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });

    return transactions.map(
      (transaction) =>
        new BonusTransactionResponseDto({
          id: transaction.id,
          transaction_type: transaction.transactionType,
          amount: transaction.amount,
          order_id: transaction.order?.id,
          description_ru: transaction.descriptionRu,
          description_en: transaction.descriptionEn,
          expires_at: transaction.expiresAt,
          created_at: transaction.createdAt,
        }),
    );
  }

  // Автоматическое начисление бонусов за заказ
  async earnBonusForOrder(
    orderId: number,
    percentage: number = 5,
  ): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    // Начисляем бонусы (например, 5% от суммы заказа)
    const bonusAmount = Math.round(order.totalAmount * (percentage / 100));

    if (bonusAmount > 0) {
      await this.earnBonus(
        order.user.id,
        bonusAmount,
        orderId,
        `Бонусы за заказ #${order.orderNumber}`,
        `Bonus for order #${order.orderNumber}`,
      );
    }
  }

  // Списание просроченных бонусов
  async expireOldBonus(userId?: number): Promise<void> {
    const now = new Date();

    let query = this.bonusRepository
      .createQueryBuilder('bonus')
      .where('bonus.transactionType = :type', {
        type: BonusTransactionType.EARNED,
      })
      .andWhere('bonus.expiresAt < :now', { now });

    if (userId) {
      query = query.andWhere('bonus.user_id = :userId', { userId });
    }

    const expiredBonuses = await query.getMany();

    for (const expiredBonus of expiredBonuses) {
      // Создаем запись о списании
      const expireTransaction = this.bonusRepository.create({
        user: expiredBonus.user,
        transactionType: BonusTransactionType.EXPIRED,
        amount: expiredBonus.amount,
        descriptionRu: `Списание просроченных бонусов`,
        descriptionEn: `Expired bonus points deduction`,
      });

      await this.bonusRepository.save(expireTransaction);
    }
  }

  // Возврат бонусов при отмене заказа
  async refundBonusForOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    // Если были использованы бонусы, возвращаем их
    if (order.bonusPointsUsed > 0) {
      await this.earnBonus(
        order.user.id,
        order.bonusPointsUsed,
        orderId,
        `Возврат бонусов за отмененный заказ #${order.orderNumber}`,
        `Refund bonus for cancelled order #${order.orderNumber}`,
      );
    }

    // Если были начислены бонусы за этот заказ, списываем их
    const earnedBonuses = await this.bonusRepository.find({
      where: {
        user: { id: order.user.id },
        order: { id: orderId },
        transactionType: BonusTransactionType.EARNED,
      },
    });

    for (const earnedBonus of earnedBonuses) {
      const refundTransaction = this.bonusRepository.create({
        user: order.user,
        transactionType: BonusTransactionType.REFUNDED,
        amount: earnedBonus.amount,
        order,
        descriptionRu: `Возврат начисленных бонусов за отмененный заказ #${order.orderNumber}`,
        descriptionEn: `Refund earned bonus for cancelled order #${order.orderNumber}`,
      });

      await this.bonusRepository.save(refundTransaction);
    }
  }
}
