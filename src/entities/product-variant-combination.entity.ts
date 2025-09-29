import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('product_variant_combinations')
export class ProductVariantCombination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column({ unique: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price_modifier: number;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.variantCombinations)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToMany(() => ProductVariant)
  @JoinTable({
    name: 'product_variant_combination_options',
    joinColumn: { name: 'combination_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variant_id', referencedColumnName: 'id' },
  })
  variants: ProductVariant[];
}
