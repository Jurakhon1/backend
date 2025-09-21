import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PromoCodeUsage } from './promo-code-usage.entity';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name_ru: string;

  @Column()
  name_en: string;

  @Column({ type: 'text', nullable: true })
  description_ru: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
  })
  discount_type: DiscountType;

  @Column('decimal', { precision: 10, scale: 2 })
  discount_value: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  min_order_amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  max_discount_amount: number;

  @Column({ type: 'int', nullable: true })
  usage_limit: number; // общий лимит использований

  @Column({ type: 'int', default: 1 })
  usage_limit_per_user: number;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @Column({ type: 'timestamp' })
  valid_until: Date;

  @OneToMany(() => PromoCodeUsage, (usage) => usage.promoCode)
  usages: PromoCodeUsage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
