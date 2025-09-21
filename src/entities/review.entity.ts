import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('product_reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'int', comment: 'Рейтинг от 1 до 5' })
  rating: number;

  @Column({ nullable: true, name: 'title_ru' })
  titleRu: string;

  @Column({ nullable: true, name: 'title_en' })
  titleEn: string;

  @Column({ type: 'text', nullable: true, name: 'content_ru' })
  contentRu: string;

  @Column({ type: 'text', nullable: true, name: 'content_en' })
  contentEn: string;

  @Column({ type: 'text', nullable: true, name: 'pros_ru' })
  prosRu: string;

  @Column({ type: 'text', nullable: true, name: 'pros_en' })
  prosEn: string;

  @Column({ type: 'text', nullable: true, name: 'cons_ru' })
  consRu: string;

  @Column({ type: 'text', nullable: true, name: 'cons_en' })
  consEn: string;

  @Column({ name: 'is_verified_purchase', default: false })
  isVerifiedPurchase: boolean;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'helpful_count', default: 0 })
  helpfulCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
