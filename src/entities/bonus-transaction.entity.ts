import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

export enum BonusTransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
}

@Entity('bonus_transactions')
export class BonusTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bonusTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: BonusTransactionType,
    name: 'transaction_type',
  })
  transactionType: BonusTransactionType;

  @Column({ type: 'int' })
  amount: number; // количество бонусов

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: true, name: 'description_ru' })
  descriptionRu: string;

  @Column({ nullable: true, name: 'description_en' })
  descriptionEn: string;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt: Date; // срок действия бонусов

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
