import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  ORDER_STATUS = 'order_status',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  PRODUCT_AVAILABLE = 'product_available',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
  REVIEW_APPROVED = 'review_approved',
  BONUS_EARNED = 'bonus_earned',
  PROMO_CODE = 'promo_code',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ name: 'title_ru' })
  titleRu: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column({ type: 'text', name: 'message_ru' })
  messageRu: string;

  @Column({ type: 'text', name: 'message_en' })
  messageEn: string;

  @Column({ type: 'json', nullable: true })
  data: any; // Дополнительные данные (ID заказа, товара и т.д.)

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ nullable: true, name: 'sent_at' })
  sentAt: Date;

  @Column({ nullable: true, name: 'read_at' })
  readAt: Date;

  @Column({ nullable: true, name: 'scheduled_at' })
  scheduledAt: Date; // Для отложенной отправки

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
