import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductSpecification } from './product-specification.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_ru: string;

  @Column()
  name_en: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductSpecification, (spec) => spec.product)
  specifications: ProductSpecification[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ nullable: true })
  model: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  description_ru: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ nullable: true })
  short_description_ru: string;

  @Column({ nullable: true })
  short_description_en: string;

  @Column('decimal', { precision: 10, scale: 2 })
  base_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_price: number;

  @Column({ default: 'RUB' })
  currency: string;

  // Добавляем недостающие поля для совместимости с Frontend
  @Column('decimal', { precision: 2, scale: 1, nullable: true, default: 0.0 })
  rating: number;

  @Column('int', { default: 0 })
  review_count: number;

  @Column('int')
  category_id: number;

  @Column('int', { nullable: true })
  brand_id: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  weight: number; // в граммах

  @Column({ nullable: true })
  dimensions: string; // например "150x75x8 мм"

  @Column({ type: 'int', default: 12 })
  warranty_months: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_featured: boolean;

  @Column('int', { default: 0 })
  stock_quantity: number;

  @Column({ type: 'int', default: 5 })
  min_stock_level: number;

  @Column({ nullable: true })
  meta_title_ru: string;

  @Column({ nullable: true })
  meta_title_en: string;

  @Column({ type: 'text', nullable: true })
  meta_description_ru: string;

  @Column({ type: 'text', nullable: true })
  meta_description_en: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
