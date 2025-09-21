import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BonusService } from './bonus.service';
import {
  BonusTransactionResponseDto,
  BonusBalanceResponseDto,
} from './dto/bonus-response.dto';
import { UseBonusDto } from './dto/use-bonus.dto';

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Get('users/:userId/balance')
  async getUserBalance(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BonusBalanceResponseDto> {
    return await this.bonusService.getUserBalance(userId);
  }

  @Get('users/:userId/transactions')
  async getUserTransactions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<BonusTransactionResponseDto[]> {
    return await this.bonusService.getUserTransactions(userId);
  }

  @Post('spend')
  @HttpCode(HttpStatus.CREATED)
  async spendBonus(
    @Body() useBonusDto: UseBonusDto,
  ): Promise<BonusTransactionResponseDto> {
    return await this.bonusService.spendBonus(useBonusDto);
  }

  @Post('earn')
  @HttpCode(HttpStatus.CREATED)
  async earnBonus(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('amount', ParseIntPipe) amount: number,
    @Body('orderId') orderId?: number,
    @Body('descriptionRu') descriptionRu?: string,
    @Body('descriptionEn') descriptionEn?: string,
  ): Promise<BonusTransactionResponseDto> {
    return await this.bonusService.earnBonus(
      userId,
      amount,
      orderId,
      descriptionRu,
      descriptionEn,
    );
  }

  @Post('orders/:orderId/earn')
  @HttpCode(HttpStatus.NO_CONTENT)
  async earnBonusForOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body('percentage') percentage?: number,
  ): Promise<void> {
    return await this.bonusService.earnBonusForOrder(orderId, percentage);
  }

  @Post('orders/:orderId/refund')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refundBonusForOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    return await this.bonusService.refundBonusForOrder(orderId);
  }

  @Post('expire')
  @HttpCode(HttpStatus.NO_CONTENT)
  async expireOldBonus(@Body('userId') userId?: number): Promise<void> {
    return await this.bonusService.expireOldBonus(userId);
  }
}
