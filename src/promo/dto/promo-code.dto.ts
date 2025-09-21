import { DiscountType } from '../../entities/promo-code.entity';

export class CreatePromoCodeDto {
  code: string;
  name_ru: string;
  name_en: string;
  description_ru?: string;
  description_en?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  valid_from: Date;
  valid_until: Date;
}

export class ValidatePromoCodeDto {
  code: string;
  user_id: number;
  order_amount: number;
}

export class ApplyPromoCodeDto {
  code: string;
  user_id: number;
  order_id: number;
  order_amount: number;
}
