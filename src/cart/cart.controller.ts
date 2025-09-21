import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({
    status: 201,
    description: 'Товар добавлен в корзину',
    type: CartItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 409, description: 'Недостаточно товара на складе' })
  async addToCart(
    @CurrentUser() user: any,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(user.id, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Корзина пользователя',
    type: CartResponseDto,
  })
  async getCart(@CurrentUser() user: any): Promise<CartResponseDto> {
    return await this.cartService.getCart(user.id);
  }

  @Put('items/:itemId')
  async updateCartItem(
    @CurrentUser() user: any,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.updateCartItem(user.id, itemId, updateDto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<void> {
    return await this.cartService.removeFromCart(user.id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@CurrentUser() user: any): Promise<void> {
    return await this.cartService.clearCart(user.id);
  }
}
