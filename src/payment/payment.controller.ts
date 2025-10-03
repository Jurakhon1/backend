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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UploadReceiptDto } from './dto/upload-receipt.dto';
import { UploadReceiptBase64Dto } from './dto/upload-receipt-base64.dto';
import {
  BankResponseDto,
  PaymentTransactionResponseDto,
} from './dto/payment-response.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('banks')
  async getActiveBanks(): Promise<BankResponseDto[]> {
    return await this.paymentService.getActiveBanks();
  }

  @Public()
  @Get('banks/:bankId')
  async getBank(
    @Param('bankId', ParseIntPipe) bankId: number,
  ): Promise<BankResponseDto> {
    return await this.paymentService.getBank(bankId);
  }

  @Public()
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

  @Public()
  @Get('orders/:orderId/active-transaction')
  @HttpCode(HttpStatus.OK)
  async getActiveOrderTransaction(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<PaymentTransactionResponseDto | null> {
    return await this.paymentService.getActiveOrderTransaction(orderId);
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

  @Put('transactions/:transactionId/upload-receipt')
  async uploadReceipt(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() uploadReceiptDto: UploadReceiptDto,
  ): Promise<PaymentTransactionResponseDto> {
    return await this.paymentService.uploadReceipt(
      transactionId,
      uploadReceiptDto.receipt_image_url,
    );
  }

  @Post('transactions/:transactionId/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/receipts',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `receipt-${req.params.transactionId}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadReceiptImage(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @UploadedFile() file: any,
  ): Promise<PaymentTransactionResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = `/uploads/receipts/${file.filename}`;
    return await this.paymentService.uploadReceipt(transactionId, imageUrl);
  }

  @Post('transactions/:transactionId/upload-receipt-base64')
  @HttpCode(HttpStatus.OK)
  async uploadReceiptBase64(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() uploadReceiptBase64Dto: UploadReceiptBase64Dto,
  ): Promise<PaymentTransactionResponseDto> {
    return await this.paymentService.uploadReceiptBase64(
      transactionId,
      uploadReceiptBase64Dto.base64_image,
      uploadReceiptBase64Dto.file_extension,
    );
  }
}
