import { IsEnum, IsOptional, IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType } from '../../entities/order.entity';

class ShippingAddressDto {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  house_number: string;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;
}

export class CreateOrderDto {
  @IsEnum(DeliveryType)
  delivery_type: DeliveryType;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address?: ShippingAddressDto | null;

  @IsOptional()
  @IsNumber()
  pickup_point_id?: number;

  @IsOptional()
  @IsNumber()
  payment_method_id?: number;

  @IsOptional()
  @IsNumber()
  prepayment_percent?: number;

  @IsOptional()
  @IsString()
  promo_code?: string | null;

  @IsOptional()
  @IsNumber()
  bonus_points_used?: number;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
