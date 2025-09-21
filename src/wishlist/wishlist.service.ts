import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from '../entities/wishlist-item.entity';
import { ProductComparison } from '../entities/product-comparison.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import {
  WishlistItemResponseDto,
  ComparisonItemResponseDto,
} from './dto/wishlist-response.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
    @InjectRepository(ProductComparison)
    private comparisonRepository: Repository<ProductComparison>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // WISHLIST METHODS

  async addToWishlist(
    userId: number,
    productId: number,
  ): Promise<WishlistItemResponseDto> {
    // Проверяем пользователя
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем продукт
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'brand'],
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверяем, нет ли уже в избранном
    const existingItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingItem) {
      throw new ConflictException('Товар уже в избранном');
    }

    // Добавляем в избранное
    const wishlistItem = this.wishlistRepository.create({
      user,
      product,
    });

    const savedItem = await this.wishlistRepository.save(wishlistItem);

    return new WishlistItemResponseDto({
      id: savedItem.id,
      product: {
        id: product.id,
        name_ru: product.name_ru,
        name_en: product.name_en,
        slug: product.slug,
        base_price: product.base_price,
        stock_quantity: product.stock_quantity,
        is_active: product.is_active,
        category: {
          id: product.category.id,
          name_ru: product.category.nameRu,
          name_en: product.category.nameEn,
        },
        brand: {
          id: product.brand.id,
          name: product.brand.name,
        },
      },
      created_at: savedItem.createdAt,
    });
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    const result = await this.wishlistRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Товар не найден в избранном');
    }
  }

  async getUserWishlist(userId: number): Promise<WishlistItemResponseDto[]> {
    const items = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.category', 'product.brand'],
      order: { createdAt: 'DESC' },
    });

    return items.map(
      (item) =>
        new WishlistItemResponseDto({
          id: item.id,
          product: {
            id: item.product.id,
            name_ru: item.product.name_ru,
            name_en: item.product.name_en,
            slug: item.product.slug,
            base_price: item.product.base_price,
            stock_quantity: item.product.stock_quantity,
            is_active: item.product.is_active,
            category: {
              id: item.product.category.id,
              name_ru: item.product.category.nameRu,
              name_en: item.product.category.nameEn,
            },
            brand: {
              id: item.product.brand.id,
              name: item.product.brand.name,
            },
          },
          created_at: item.createdAt,
        }),
    );
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const item = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    return !!item;
  }

  // COMPARISON METHODS

  async addToComparison(
    userId: number,
    productId: number,
  ): Promise<ComparisonItemResponseDto> {
    // Проверяем лимит сравнения (максимум 3 товара)
    const comparisonCount = await this.comparisonRepository.count({
      where: { user: { id: userId } },
    });

    if (comparisonCount >= 3) {
      throw new BadRequestException('Можно сравнивать максимум 3 товара');
    }

    // Проверяем пользователя
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем продукт
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'brand'],
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверяем, нет ли уже в сравнении
    const existingItem = await this.comparisonRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingItem) {
      throw new ConflictException('Товар уже в сравнении');
    }

    // Добавляем в сравнение
    const comparisonItem = this.comparisonRepository.create({
      user,
      product,
    });

    const savedItem = await this.comparisonRepository.save(comparisonItem);

    return new ComparisonItemResponseDto({
      id: savedItem.id,
      product: {
        id: product.id,
        name_ru: product.name_ru,
        name_en: product.name_en,
        slug: product.slug,
        base_price: product.base_price,
        stock_quantity: product.stock_quantity,
        category: {
          id: product.category.id,
          name_ru: product.category.nameRu,
          name_en: product.category.nameEn,
        },
        brand: {
          id: product.brand.id,
          name: product.brand.name,
        },
      },
      created_at: savedItem.createdAt,
    });
  }

  async removeFromComparison(userId: number, productId: number): Promise<void> {
    const result = await this.comparisonRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Товар не найден в сравнении');
    }
  }

  async getUserComparison(
    userId: number,
  ): Promise<ComparisonItemResponseDto[]> {
    const items = await this.comparisonRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.category', 'product.brand'],
      order: { createdAt: 'ASC' },
    });

    return items.map(
      (item) =>
        new ComparisonItemResponseDto({
          id: item.id,
          product: {
            id: item.product.id,
            name_ru: item.product.name_ru,
            name_en: item.product.name_en,
            slug: item.product.slug,
            base_price: item.product.base_price,
            stock_quantity: item.product.stock_quantity,
            category: {
              id: item.product.category.id,
              name_ru: item.product.category.nameRu,
              name_en: item.product.category.nameEn,
            },
            brand: {
              id: item.product.brand.id,
              name: item.product.brand.name,
            },
          },
          created_at: item.createdAt,
        }),
    );
  }

  async clearComparison(userId: number): Promise<void> {
    await this.comparisonRepository.delete({ user: { id: userId } });
  }
}
