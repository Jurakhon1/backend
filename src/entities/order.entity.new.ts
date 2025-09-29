import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { PickupPoint } from './pickup-point.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PAYMENT_EXPIRED = 'payment_expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PREPAID = 'prepaid',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum ShippingStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

export enum DeliveryType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'order_number' })
  orderNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    name: 'payment_status',
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
    name: 'shipping_status',
  })
  shippingStatus: ShippingStatus;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    name: 'delivery_type',
  })
  deliveryType: DeliveryType;

  // Адрес доставки (JSON)
  @Column({ type: 'json', nullable: true, name: 'shipping_address' })
  shippingAddress: {
    country: string;
    city: string;
    street: string;
    house_number: string;
    apartment?: string;
    postal_code?: string;
  };

  @ManyToOne(() => PickupPoint, { nullable: true })
  @JoinColumn({ name: 'pickup_point_id' })
  pickupPoint: PickupPoint;

  // Стоимость
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    name: 'tax_amount',
  })
  taxAmount: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    name: 'shipping_cost',
  })
  shippingCost: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    name: 'discount_amount',
  })
  discountAmount: number;

  @Column({ type: 'int', default: 0, name: 'bonus_points_used' })
  bonusPointsUsed: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    name: 'prepaid_amount',
  })
  prepaidAmount: number; // 10% предоплата

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    name: 'remaining_amount',
  })
  remainingAmount: number; // оставшаяся сумма

  // Таймер оплаты
  @Column({ type: 'timestamp', nullable: true, name: 'payment_deadline' })
  paymentDeadline: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, name: 'tracking_number' })
  trackingNumber: string;

  @Column({ type: 'date', nullable: true, name: 'estimated_delivery_date' })
  estimatedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true, name: 'actual_delivery_date' })
  actualDeliveryDate: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
