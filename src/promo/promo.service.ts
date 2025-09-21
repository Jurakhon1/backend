import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode, DiscountType } from '../entities/promo-code.entity';
import { PromoCodeUsage } from '../entities/promo-code-usage.entity';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import {
  CreatePromoCodeDto,
  ValidatePromoCodeDto,
  ApplyPromoCodeDto,
} from './dto/promo-code.dto';
import {
  PromoCodeResponseDto,
  PromoCodeValidationResponseDto,
} from './dto/promo-code-response.dto';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoCode)
    private promoRepository: Repository<PromoCode>,
    @InjectRepository(PromoCodeUsage)
    private usageRepository: Repository<PromoCodeUsage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createPromoCode(
    createDto: CreatePromoCodeDto,
  ): Promise<PromoCodeResponseDto> {
    // Проверяем уникальность кода
    const existingCode = await this.promoRepository.findOne({
      where: { code: createDto.code },
    });

    if (existingCode) {
      throw new ConflictException('Промокод с таким кодом уже существует');
    }

    const promoCode = this.promoRepository.create(createDto);
    const savedCode = await this.promoRepository.save(promoCode);

    return new PromoCodeResponseDto(savedCode);
  }

  async getActivePromoCodes(): Promise<PromoCodeResponseDto[]> {
    const now = new Date();
    const promoCodes = await this.promoRepository.find({
      where: {
        is_active: true,
      },
      order: { created_at: 'DESC' },
    });

    // Фильтруем по дате действия
    const activeCodes = promoCodes.filter(
      (code) => code.valid_from <= now && code.valid_until >= now,
    );

    return activeCodes.map((code) => new PromoCodeResponseDto(code));
  }

  async validatePromoCode(
    validateDto: ValidatePromoCodeDto,
  ): Promise<PromoCodeValidationResponseDto> {
    const { code, user_id, order_amount } = validateDto;

    const promoCode = await this.promoRepository.findOne({
      where: { code, is_active: true },
      relations: ['usages'],
    });

    if (!promoCode) {
      return new PromoCodeValidationResponseDto({
        valid: false,
        discount_amount: 0,
        message_ru: 'Промокод не найден или неактивен',
        message_en: 'Promo code not found or inactive',
      });
    }

    // Проверяем срок действия
    const now = new Date();
    if (promoCode.valid_from > now || promoCode.valid_until < now) {
      return new PromoCodeValidationResponseDto({
        valid: false,
        discount_amount: 0,
        message_ru: 'Срок действия промокода истек',
        message_en: 'Promo code has expired',
      });
    }

    // Проверяем минимальную сумму заказа
    if (order_amount < promoCode.min_order_amount) {
      return new PromoCodeValidationResponseDto({
        valid: false,
        discount_amount: 0,
        message_ru: `Минимальная сумма заказа для применения промокода: ${promoCode.min_order_amount}`,
        message_en: `Minimum order amount required: ${promoCode.min_order_amount}`,
      });
    }

    // Проверяем общий лимит использований
    if (
      promoCode.usage_limit &&
      promoCode.used_count >= promoCode.usage_limit
    ) {
      return new PromoCodeValidationResponseDto({
        valid: false,
        discount_amount: 0,
        message_ru: 'Промокод исчерпан',
        message_en: 'Promo code usage limit exceeded',
      });
    }

    // Проверяем лимит использований на пользователя
    const userUsageCount = await this.usageRepository.count({
      where: {
        promoCode: { id: promoCode.id },
        user: { id: user_id },
      },
    });

    if (userUsageCount >= promoCode.usage_limit_per_user) {
      return new PromoCodeValidationResponseDto({
        valid: false,
        discount_amount: 0,
        message_ru: 'Вы уже использовали этот промокод',
        message_en: 'You have already used this promo code',
      });
    }

    // Рассчитываем скидку
    const discountAmount = this.calculateDiscount(promoCode, order_amount);

    return new PromoCodeValidationResponseDto({
      valid: true,
      discount_amount: discountAmount,
      promo_code: {
        id: promoCode.id,
        code: promoCode.code,
        name_ru: promoCode.name_ru,
        name_en: promoCode.name_en,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
      },
    });
  }

  async applyPromoCode(applyDto: ApplyPromoCodeDto): Promise<number> {
    const { code, user_id, order_id, order_amount } = applyDto;

    // Сначала валидируем
    const validation = await this.validatePromoCode({
      code,
      user_id,
      order_amount,
    });

    if (!validation.valid) {
      throw new BadRequestException(validation.message_ru);
    }

    const promoCode = await this.promoRepository.findOne({
      where: { code },
    });

    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    const order = await this.orderRepository.findOne({
      where: { id: order_id },
    });

    if (!promoCode || !user || !order) {
      throw new NotFoundException('Промокод, пользователь или заказ не найден');
    }

    // Создаем запись об использовании
    const usage = this.usageRepository.create({
      promoCode: promoCode,
      user,
      order,
      discountAmount: validation.discount_amount,
    });

    await this.usageRepository.save(usage);

    // Обновляем счетчик использований
    promoCode.used_count += 1;
    await this.promoRepository.save(promoCode);

    return validation.discount_amount;
  }

  async getUserPromoCodeUsage(userId: number): Promise<PromoCodeUsage[]> {
    return await this.usageRepository.find({
      where: { user: { id: userId } },
      relations: ['promo_code', 'order'],
      order: { usedAt: 'DESC' },
    });
  }

  private calculateDiscount(promoCode: PromoCode, orderAmount: number): number {
    let discount = 0;

    switch (promoCode.discount_type) {
      case DiscountType.PERCENTAGE:
        discount = (orderAmount * promoCode.discount_value) / 100;
        break;
      case DiscountType.FIXED_AMOUNT:
        discount = promoCode.discount_value;
        break;
      case DiscountType.FREE_SHIPPING:
        // Для бесплатной доставки возвращаем фиксированную сумму
        // В реальном проекте это должно браться из настроек
        discount = 500; // примерная стоимость доставки
        break;
    }

    // Применяем максимальную скидку, если она установлена
    if (
      promoCode.max_discount_amount &&
      discount > promoCode.max_discount_amount
    ) {
      discount = promoCode.max_discount_amount;
    }

    // Скидка не может быть больше суммы заказа
    if (discount > orderAmount) {
      discount = orderAmount;
    }

    return Math.round(discount * 100) / 100; // округляем до копеек
  }

  async getPromoCodeById(id: number): Promise<PromoCodeResponseDto> {
    const promoCode = await this.promoRepository.findOne({
      where: { id },
    });

    if (!promoCode) {
      throw new NotFoundException('Промокод не найден');
    }

    return new PromoCodeResponseDto(promoCode);
  }

  async updatePromoCode(
    id: number,
    updateData: Partial<CreatePromoCodeDto>,
  ): Promise<PromoCodeResponseDto> {
    const promoCode = await this.promoRepository.findOne({
      where: { id },
    });

    if (!promoCode) {
      throw new NotFoundException('Промокод не найден');
    }

    // Проверяем уникальность кода при обновлении
    if (updateData.code && updateData.code !== promoCode.code) {
      const existingCode = await this.promoRepository.findOne({
        where: { code: updateData.code },
      });

      if (existingCode) {
        throw new ConflictException('Промокод с таким кодом уже существует');
      }
    }

    Object.assign(promoCode, updateData);
    const updatedCode = await this.promoRepository.save(promoCode);

    return new PromoCodeResponseDto(updatedCode);
  }

  async deletePromoCode(id: number): Promise<void> {
    const result = await this.promoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Промокод не найден');
    }
  }
}
