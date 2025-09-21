import { DiscountType } from '../../entities/promo-code.entity';

export class PromoCodeResponseDto {
  id: number;
  code: string;
  name_ru: string;
  name_en: string;
  description_ru?: string;
  description_en?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_limit_per_user: number;
  used_count: number;
  is_active: boolean;
  valid_from: Date;
  valid_until: Date;
  created_at: Date;

  constructor(partial: Partial<PromoCodeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PromoCodeValidationResponseDto {
  valid: boolean;
  discount_amount: number;
  message_ru?: string;
  message_en?: string;
  promo_code?: {
    id: number;
    code: string;
    name_ru: string;
    name_en: string;
    discount_type: DiscountType;
    discount_value: number;
  };

  constructor(partial: Partial<PromoCodeValidationResponseDto>) {
    Object.assign(this, partial);
  }
}
