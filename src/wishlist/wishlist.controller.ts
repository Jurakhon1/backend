import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import {
  WishlistItemResponseDto,
  ComparisonItemResponseDto,
} from './dto/wishlist-response.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // WISHLIST ENDPOINTS

  @Post(':userId/products/:productId')
  @HttpCode(HttpStatus.CREATED)
  async addToWishlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<WishlistItemResponseDto> {
    return await this.wishlistService.addToWishlist(userId, productId);
  }

  @Delete(':userId/products/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromWishlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return await this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get(':userId')
  async getUserWishlist(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<WishlistItemResponseDto[]> {
    return await this.wishlistService.getUserWishlist(userId);
  }

  @Get(':userId/products/:productId/check')
  async isInWishlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ inWishlist: boolean }> {
    const inWishlist = await this.wishlistService.isInWishlist(
      userId,
      productId,
    );
    return { inWishlist };
  }

  // COMPARISON ENDPOINTS

  @Post(':userId/comparison/:productId')
  @HttpCode(HttpStatus.CREATED)
  async addToComparison(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ComparisonItemResponseDto> {
    return await this.wishlistService.addToComparison(userId, productId);
  }

  @Delete(':userId/comparison/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromComparison(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return await this.wishlistService.removeFromComparison(userId, productId);
  }

  @Get(':userId/comparison')
  async getUserComparison(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ComparisonItemResponseDto[]> {
    return await this.wishlistService.getUserComparison(userId);
  }

  @Delete(':userId/comparison')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearComparison(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.wishlistService.clearComparison(userId);
  }
}
