import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  BankResponseDto,
  PaymentTransactionResponseDto,
} from './dto/payment-response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('banks')
  async getActiveBanks(): Promise<BankResponseDto[]> {
    return await this.paymentService.getActiveBanks();
  }

  @Get('banks/:bankId')
  async getBank(
    @Param('bankId', ParseIntPipe) bankId: number,
  ): Promise<BankResponseDto> {
    return await this.paymentService.getBank(bankId);
  }

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentTransaction(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentTransactionResponseDto> {
    return await this.paymentService.createPaymentTransaction(createPaymentDto);
  }

  @Get('orders/:orderId/transactions')
  async getOrderTransactions(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<PaymentTransactionResponseDto[]> {
    return await this.paymentService.getOrderTransactions(orderId);
  }

  @Get('transactions/pending')
  async getPendingTransactions(): Promise<PaymentTransactionResponseDto[]> {
    return await this.paymentService.getPendingTransactions();
  }

  @Put('transactions/:transactionId/confirm')
  async confirmPayment(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body('adminId', ParseIntPipe) adminId: number,
    @Body('adminNotes') adminNotes?: string,
  ): Promise<PaymentTransactionResponseDto> {
    return await this.paymentService.confirmPayment(
      transactionId,
      adminId,
      adminNotes,
    );
  }

  @Put('transactions/:transactionId/reject')
  async rejectPayment(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body('adminId', ParseIntPipe) adminId: number,
    @Body('adminNotes') adminNotes: string,
  ): Promise<PaymentTransactionResponseDto> {
    return await this.paymentService.rejectPayment(
      transactionId,
      adminId,
      adminNotes,
    );
  }
}
