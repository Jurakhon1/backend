import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    // Проверяем существование товара
    const product = await this.productRepository.findOne({
      where: { id: createReviewDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Проверяем, не оставлял ли пользователь уже отзыв на этот товар
    const existingReview = await this.reviewRepository.findOne({
      where: {
        product: { id: createReviewDto.productId },
        user: { id: userId },
      },
    });

    if (existingReview) {
      throw new ForbiddenException('Вы уже оставляли отзыв на этот товар');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const review = this.reviewRepository.create({
      product,
      user,
      rating: createReviewDto.rating,
      titleRu: createReviewDto.title,
      contentRu: createReviewDto.comment,
      prosRu: createReviewDto.pros,
      consRu: createReviewDto.cons,
      isVerifiedPurchase: false, // TODO: проверить покупку
    });

    const savedReview = await this.reviewRepository.save(review);
    return this.mapToResponseDto(savedReview);
  }

  async findByProduct(
    productId: number,
    limit = 10,
    offset = 0,
    rating?: number,
  ): Promise<{
    reviews: ReviewResponseDto[];
    total: number;
    averageRating: number;
  }> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true })
      .orderBy('review.createdAt', 'DESC');

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    const [reviews, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // Получаем средний рейтинг
    const avgResult = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true })
      .getRawOne();

    const averageRating = parseFloat(avgResult.avg) || 0;

    return {
      reviews: reviews.map((review) => this.mapToResponseDto(review)),
      total,
      averageRating: Math.round(averageRating * 10) / 10, // округляем до 1 знака
    };
  }

  async findByUser(userId: number): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map((review) => this.mapToResponseDto(review));
  }

  async findOne(id: number): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    return this.mapToResponseDto(review);
  }

  async update(
    id: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException(
        'Вы можете редактировать только свои отзывы',
      );
    }

    Object.assign(review, updateReviewDto);
    review.isApproved = false; // требует повторной модерации

    const updatedReview = await this.reviewRepository.save(review);
    return this.mapToResponseDto(updatedReview);
  }

  async remove(id: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои отзывы');
    }

    await this.reviewRepository.remove(review);
  }

  // Админские методы
  async approve(id: number): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    review.isApproved = true;
    const updatedReview = await this.reviewRepository.save(review);
    return this.mapToResponseDto(updatedReview);
  }

  async getProductRatingStats(productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'AVG(review.rating) as averageRating',
        'COUNT(*) as totalReviews',
        'review.rating as rating',
        'COUNT(review.rating) as count',
      ])
      .where('review.product_id = :productId', { productId })
      .andWhere('review.is_approved = :approved', { approved: true })
      .groupBy('review.rating')
      .getRawMany();

    const averageRating =
      stats.length > 0 ? parseFloat(stats[0].averageRating) : 0;
    const totalReviews = stats.reduce(
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    const ratingDistribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = 0;
    }

    stats.forEach((stat) => {
      ratingDistribution[stat.rating] = parseInt(stat.count);
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      productId: review.product.id,
      userId: review.user.id,
      userFirstName: review.user.firstName,
      userLastName: review.user.lastName,
      rating: review.rating,
      title: review.titleRu || review.titleEn,
      comment: review.contentRu || review.contentEn,
      pros: review.prosRu || review.prosEn,
      cons: review.consRu || review.consEn,
      isVerifiedPurchase: review.isVerifiedPurchase,
      isApproved: review.isApproved,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
