import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { ImageService } from '../shared/image.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private imageService: ImageService,
  ) {}

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<CartItemResponseDto> {
    // Проверяем существование пользователя
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем существование продукта
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.product_id },
      relations: ['brand', 'images'],
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверяем наличие товара на складе
    if (product.stock_quantity < addToCartDto.quantity) {
      throw new ConflictException('Недостаточно товара на складе');
    }

    // Проверяем, есть ли уже такой товар в корзине
    let cartItem = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: addToCartDto.product_id },
      },
      relations: ['product'],
    });

    if (cartItem) {
      // Обновляем количество
      cartItem.quantity += addToCartDto.quantity;
      if (cartItem.quantity > product.stock_quantity) {
        throw new ConflictException('Недостаточно товара на складе');
      }
    } else {
      // Создаем новую позицию в корзине
      cartItem = this.cartRepository.create({
        user,
        product,
        quantity: addToCartDto.quantity,
        price: product.base_price,
      });
    }

    const savedItem = await this.cartRepository.save(cartItem);

    return new CartItemResponseDto({
      id: savedItem.id,
      product: {
        id: product.id,
        name_ru: product.name_ru,
        name_en: product.name_en,
        slug: product.slug,
        base_price: product.base_price,
        stock_quantity: product.stock_quantity,
        brand: {
          id: product.brand.id,
          name_ru: product.brand.name,
          name_en: product.brand.name,
        },
        images: product.images?.map(image => ({
          id: image.id,
          image_url: image.imageUrl,
          alt_text_ru: image.altTextRu || '',
          alt_text_en: image.altTextEn || '',
          sort_order: image.sortOrder,
          is_primary: image.isPrimary,
        })) || [],
      },
      quantity: savedItem.quantity,
      price: savedItem.price,
      total_price: savedItem.price * savedItem.quantity,
      created_at: savedItem.createdAt,
      updated_at: savedItem.updatedAt,
    });
  }

  async getCart(userId: number): Promise<CartResponseDto> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.brand', 'product.images'],
      order: { createdAt: 'DESC' },
    });

    const items = cartItems.map(
      (item) =>
        new CartItemResponseDto({
          id: item.id,
          product: {
            id: item.product.id,
            name_ru: item.product.name_ru,
            name_en: item.product.name_en,
            slug: item.product.slug,
            base_price: item.product.base_price,
            stock_quantity: item.product.stock_quantity,
            brand: {
              id: item.product.brand.id,
              name_ru: item.product.brand.name,
              name_en: item.product.brand.name,
            },
            images: item.product.images?.map(image => ({
              id: image.id,
              image_url: image.imageUrl,
              alt_text_ru: image.altTextRu || '',
              alt_text_en: image.altTextEn || '',
              sort_order: image.sortOrder,
              is_primary: image.isPrimary,
            })) || [],
          },
          quantity: item.quantity,
          price: item.price,
          total_price: item.price * item.quantity,
          created_at: item.createdAt,
          updated_at: item.updatedAt,
        }),
    );

    return new CartResponseDto(items);
  }

  async updateCartItem(
    userId: number,
    itemId: number,
    updateDto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, user: { id: userId } },
      relations: ['product', 'product.brand', 'product.images'],
    });

    if (!cartItem) {
      throw new NotFoundException('Товар в корзине не найден');
    }

    // Проверяем наличие на складе
    if (updateDto.quantity > cartItem.product.stock_quantity) {
      throw new ConflictException('Недостаточно товара на складе');
    }

    cartItem.quantity = updateDto.quantity;
    const savedItem = await this.cartRepository.save(cartItem);

    return new CartItemResponseDto({
      id: savedItem.id,
      product: {
        id: cartItem.product.id,
        name_ru: cartItem.product.name_ru,
        name_en: cartItem.product.name_en,
        slug: cartItem.product.slug,
        base_price: cartItem.product.base_price,
        stock_quantity: cartItem.product.stock_quantity,
        brand: {
          id: cartItem.product.brand.id,
          name_ru: cartItem.product.brand.name,
          name_en: cartItem.product.brand.name,
        },
        images: cartItem.product.images?.map(image => ({
          id: image.id,
          image_url: image.imageUrl,
          alt_text_ru: image.altTextRu || '',
          alt_text_en: image.altTextEn || '',
          sort_order: image.sortOrder,
          is_primary: image.isPrimary,
        })) || [],
      },
      quantity: savedItem.quantity,
      price: savedItem.price,
      total_price: savedItem.price * savedItem.quantity,
      created_at: savedItem.createdAt,
      updated_at: savedItem.updatedAt,
    });
  }

  async removeFromCart(userId: number, itemId: number): Promise<void> {
    const result = await this.cartRepository.delete({
      id: itemId,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Товар в корзине не найден');
    }
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ user: { id: userId } });
  }

  async applyPromoCode(
    userId: number,
    code: string,
  ): Promise<{
    promoCode: any;
    discountAmount: number;
    totalAmount: number;
  }> {
    // Простая реализация применения промокода
    // В реальном приложении нужно проверить валидность промокода
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Простая логика скидки 10% для демонстрации
    const discountAmount = subtotal * 0.1;
    const totalAmount = subtotal - discountAmount;

    return {
      promoCode: {
        code,
        discountType: 'percentage',
        discountValue: 10,
      },
      discountAmount,
      totalAmount,
    };
  }

  async removePromoCode(userId: number): Promise<void> {
    // В реальном приложении нужно удалить промокод из сессии/хранилища
    return Promise.resolve();
  }

  async getCartTotals(userId: number): Promise<{
    subtotal: number;
    taxAmount: number;
    shippingCost: number;
    discountAmount: number;
    bonusPointsUsed: number;
    totalAmount: number;
    promoCode?: any;
  }> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const taxAmount = subtotal * 0.2; // НДС 20%
    const shippingCost = subtotal > 5000 ? 0 : 300; // Бесплатная доставка от 5000
    const discountAmount = 0; // Пока без скидок
    const bonusPointsUsed = 0; // Пока без бонусов

    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;

    return {
      subtotal,
      taxAmount,
      shippingCost,
      discountAmount,
      bonusPointsUsed,
      totalAmount,
    };
  }
}
