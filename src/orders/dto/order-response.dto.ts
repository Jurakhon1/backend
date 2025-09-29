import {
  OrderStatus,
  PaymentStatus,
  DeliveryType,
} from '../../entities/order.entity';

export class OrderItemResponseDto {
  id: number;
  product: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
  };
  product_name_ru: string;
  product_name_en: string;
  variant_info_ru?: string;
  variant_info_en?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export class OrderResponseDto {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_type: DeliveryType;
  shipping_address?: any;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  bonus_points_used: number;
  total_amount: number;
  prepaid_amount: number;
  remaining_amount: number;
  payment_deadline?: Date | null;
  notes?: string;
  tracking_number?: string;
  estimated_delivery_date?: Date;
  actual_delivery_date?: Date;
  items: OrderItemResponseDto[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<OrderResponseDto>) {
    Object.assign(this, partial);
  }
}
