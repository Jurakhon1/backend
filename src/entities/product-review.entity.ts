import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { ReviewHelpfulness } from './review-helpfulness.entity';

@Entity('product_reviews')
@Unique(['user', 'product'])
@Check('"rating" >= 1 AND "rating" <= 5')
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Column({ type: 'int' })
  rating: number; // от 1 до 5

  @Column({ nullable: true })
  title_ru: string;

  @Column({ nullable: true })
  title_en: string;

  @Column({ type: 'text', nullable: true })
  content_ru: string;

  @Column({ type: 'text', nullable: true })
  content_en: string;

  @Column({ type: 'text', nullable: true })
  pros_ru: string;

  @Column({ type: 'text', nullable: true })
  pros_en: string;

  @Column({ type: 'text', nullable: true })
  cons_ru: string;

  @Column({ type: 'text', nullable: true })
  cons_en: string;

  @Column({ default: false })
  is_verified_purchase: boolean;

  @Column({ default: false })
  is_approved: boolean;

  @Column({ type: 'int', default: 0 })
  helpful_count: number;

  @OneToMany(() => ReviewHelpfulness, (helpfulness) => helpfulness.review)
  helpfulness_votes: ReviewHelpfulness[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
