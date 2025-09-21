import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать отзыв о товаре' })
  @ApiResponse({
    status: 201,
    description: 'Отзыв создан',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 403, description: 'Отзыв уже существует' })
  async create(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.create(user.id, createReviewDto);
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Получить отзывы о товаре' })
  @ApiParam({ name: 'productId', type: 'number', description: 'ID товара' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество отзывов',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: 'number',
    description: 'Фильтр по рейтингу',
  })
  @ApiResponse({
    status: 200,
    description: 'Отзывы о товаре',
    schema: {
      type: 'object',
      properties: {
        reviews: {
          type: 'array',
          items: { $ref: '#/components/schemas/ReviewResponseDto' },
        },
        total: { type: 'number' },
        averageRating: { type: 'number' },
      },
    },
  })
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('rating') rating?: number,
  ) {
    return await this.reviewsService.findByProduct(
      productId,
      limit || 10,
      offset || 0,
      rating,
    );
  }

  @Get('product/:productId/stats')
  @Public()
  @ApiOperation({ summary: 'Получить статистику рейтинга товара' })
  @ApiParam({ name: 'productId', type: 'number', description: 'ID товара' })
  @ApiResponse({
    status: 200,
    description: 'Статистика рейтинга',
    schema: {
      type: 'object',
      properties: {
        averageRating: { type: 'number' },
        totalReviews: { type: 'number' },
        ratingDistribution: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getProductRatingStats(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.reviewsService.getProductRatingStats(productId);
  }

  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить мои отзывы' })
  @ApiResponse({
    status: 200,
    description: 'Отзывы пользователя',
    type: [ReviewResponseDto],
  })
  async findMyReviews(@CurrentUser() user: any): Promise<ReviewResponseDto[]> {
    return await this.reviewsService.findByUser(user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить отзыв по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({
    status: 200,
    description: 'Информация об отзыве',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить отзыв' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({
    status: 200,
    description: 'Отзыв обновлен',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @ApiResponse({ status: 403, description: 'Нет прав на редактирование' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.update(id, user.id, updateReviewDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({ status: 204, description: 'Отзыв удален' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @ApiResponse({ status: 403, description: 'Нет прав на удаление' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<void> {
    return await this.reviewsService.remove(id, user.id);
  }

  @Patch(':id/approve')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Одобрить отзыв (только для админов)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({
    status: 200,
    description: 'Отзыв одобрен',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.approve(id);
  }
}
