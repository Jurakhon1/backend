import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_ru' })
  nameRu: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true, name: 'description_ru' })
  descriptionRu: string;

  @Column({ type: 'text', nullable: true, name: 'description_en' })
  descriptionEn: string;

  @Column({ nullable: true, name: 'icon_url' })
  iconUrl: string;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ nullable: true, name: 'meta_title_ru' })
  metaTitleRu: string;

  @Column({ nullable: true, name: 'meta_title_en' })
  metaTitleEn: string;

  @Column({ type: 'text', nullable: true, name: 'meta_description_ru' })
  metaDescriptionRu: string;

  @Column({ type: 'text', nullable: true, name: 'meta_description_en' })
  metaDescriptionEn: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
