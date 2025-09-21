import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum VariantType {
  COLOR = 'color',
  MEMORY = 'memory',
  STORAGE = 'storage',
  SIZE = 'size',
  OTHER = 'other',
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  variantNameRu: string;

  @Column()
  variantNameEn: string;

  @Column({
    type: 'enum',
    enum: VariantType,
  })
  variantType: VariantType;

  @Column()
  variantValueRu: string;

  @Column()
  variantValueEn: string;

  @Column({ nullable: true })
  colorCode: string; // hex код цвета

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  priceModifier: number; // дополнительная стоимость

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  skuSuffix: string; // суффикс для SKU

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
