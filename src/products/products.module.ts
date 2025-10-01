import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductSpecification } from '../entities/product-specification.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariantCombination } from '../entities/product-variant-combination.entity';

import { ImageService } from '../services/image.service';

import { ProductColorImage } from '../entities/product-color-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Brand,
      ProductVariant,
      ProductSpecification,
      ProductImage,
      ProductVariantCombination,
      ProductColorImage,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ImageService],
  exports: [ProductsService],
})
export class ProductsModule {}
