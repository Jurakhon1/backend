import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum RelationType {
  ACCESSORY = 'accessory',
  SIMILAR = 'similar',
  COMPLEMENTARY = 'complementary',
  UPSELL = 'upsell',
}

@Entity('product_relations')
export class ProductRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'related_product_id' })
  relatedProduct: Product;

  @Column({
    type: 'enum',
    enum: RelationType,
    name: 'relation_type',
  })
  relationType: RelationType;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
