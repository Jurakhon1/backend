import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PromoService } from './promo.service';
import {
  CreatePromoCodeDto,
  ValidatePromoCodeDto,
  ApplyPromoCodeDto,
} from './dto/promo-code.dto';
import {
  PromoCodeResponseDto,
  PromoCodeValidationResponseDto,
} from './dto/promo-code-response.dto';

@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPromoCode(
    @Body() createDto: CreatePromoCodeDto,
  ): Promise<PromoCodeResponseDto> {
    return await this.promoService.createPromoCode(createDto);
  }

  @Get()
  async getActivePromoCodes(): Promise<PromoCodeResponseDto[]> {
    return await this.promoService.getActivePromoCodes();
  }

  @Get(':id')
  async getPromoCodeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PromoCodeResponseDto> {
    return await this.promoService.getPromoCodeById(id);
  }

  @Put(':id')
  async updatePromoCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreatePromoCodeDto>,
  ): Promise<PromoCodeResponseDto> {
    return await this.promoService.updatePromoCode(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePromoCode(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.promoService.deletePromoCode(id);
  }

  @Post('validate')
  async validatePromoCode(
    @Body() validateDto: ValidatePromoCodeDto,
  ): Promise<PromoCodeValidationResponseDto> {
    return await this.promoService.validatePromoCode(validateDto);
  }

  @Post('apply')
  async applyPromoCode(
    @Body() applyDto: ApplyPromoCodeDto,
  ): Promise<{ discount_amount: number }> {
    const discountAmount = await this.promoService.applyPromoCode(applyDto);
    return { discount_amount: discountAmount };
  }

  @Get('users/:userId/usage')
  async getUserPromoCodeUsage(@Param('userId', ParseIntPipe) userId: number) {
    return await this.promoService.getUserPromoCodeUsage(userId);
  }
}
