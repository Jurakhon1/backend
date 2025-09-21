import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_specifications')
export class ProductSpecification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  specNameRu: string;

  @Column()
  specNameEn: string;

  @Column()
  specValueRu: string;

  @Column()
  specValueEn: string;

  @Column({ nullable: true })
  specGroup: string; // например "Основные", "Камера", "Батарея"

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
