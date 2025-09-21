import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { User } from './user.entity';

@Entity('review_helpfulness')
export class ReviewHelpfulness {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_helpful' })
  isHelpful: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
