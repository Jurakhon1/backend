import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { ImageService } from '../shared/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService, ImageService],
  exports: [CartService],
})
export class CartModule {}
