import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PromoCode } from './promo-code.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('promo_code_usage')
export class PromoCodeUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PromoCode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promo_code_id' })
  promoCode: PromoCode;

  @ManyToOne(() => User, (user) => user.promoCodeUsages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column('decimal', { precision: 10, scale: 2, name: 'discount_amount' })
  discountAmount: number;

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;
}
