import { DeliveryType } from '../../entities/order.entity';

export class CreateOrderDto {
  delivery_type: DeliveryType;
  shipping_address?: {
    country: string;
    city: string;
    street: string;
    house_number: string;
    apartment?: string;
    postal_code?: string;
  };
  pickup_point_id?: number;
  promo_code?: string;
  bonus_points_used?: number;
  notes?: string;
}
