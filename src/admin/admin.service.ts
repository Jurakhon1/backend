import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { Review } from '../entities/review.entity';
import {
  AdminStatsDto,
  UserStatsDto,
  ProductStatsDto,
} from './dto/admin-stats.dto';
import {
  UpdateUserStatusDto,
  AdminUserResponseDto,
  AdminProductManagementDto,
} from './dto/admin-user-management.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getDashboardStats(): Promise<AdminStatsDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Статистика пользователей
    const totalUsers = await this.userRepository.count();
    const newUsersLast30Days = await this.userRepository.count({
      where: { createdAt: MoreThan(thirtyDaysAgo) },
    });

    // Статистика товаров
    const totalProducts = await this.productRepository.count();
    const newProductsLast30Days = await this.productRepository.count({
      where: { created_at: MoreThan(thirtyDaysAgo) },
    });

    // Статистика заказов
    const totalOrders = await this.orderRepository.count();
    const newOrdersLast30Days = await this.orderRepository.count({
      where: { created_at: MoreThan(thirtyDaysAgo) },
    });

    // Доходы
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: ['completed', 'delivered'],
      })
      .getRawOne();

    const revenueLastMonth = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: ['completed', 'delivered'],
      })
      .andWhere('order.created_at > :date', { date: thirtyDaysAgo })
      .getRawOne();

    // Дополнительная статистика
    const pendingReviews = await this.reviewRepository.count({
      where: { isApproved: false },
    });

    const inactiveProducts = await this.productRepository.count({
      where: { is_active: false },
    });

    const lowStockProducts = await this.productRepository.count({
      where: { stock_quantity: 5 }, // товары с остатком <= 5
    });

    const blockedUsers = await this.userRepository.count({
      where: { isActive: false },
    });

    return {
      totalUsers,
      newUsersLast30Days,
      totalProducts,
      newProductsLast30Days,
      totalOrders,
      newOrdersLast30Days,
      totalRevenue: parseFloat(revenueResult?.total) || 0,
      revenueLast30Days: parseFloat(revenueLastMonth?.total) || 0,
      pendingReviews,
      inactiveProducts,
      lowStockProducts,
      blockedUsers,
    };
  }

  async getUserStats(
    limit = 20,
    offset = 0,
  ): Promise<{ users: UserStatsDto[]; total: number }> {
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'order')
      .addSelect([
        'COUNT(order.id) as ordersCount',
        'COALESCE(SUM(order.total_amount), 0) as totalSpent',
        'MAX(order.created_at) as lastOrderDate',
      ])
      .groupBy('user.id')
      .orderBy('user.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const userStats = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      ordersCount: parseInt(user.ordersCount) || 0,
      totalSpent: parseFloat(user.totalSpent) || 0,
      lastOrderDate: user.lastOrderDate,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));

    return { users: userStats, total };
  }

  async getProductStats(
    limit = 20,
    offset = 0,
  ): Promise<{ products: ProductStatsDto[]; total: number }> {
    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review', 'review.is_approved = :approved', {
        approved: true,
      })
      .leftJoin('product.orderItems', 'orderItem')
      .addSelect([
        'COUNT(DISTINCT orderItem.id) as salesCount',
        'AVG(review.rating) as averageRating',
        'COUNT(DISTINCT review.id) as reviewsCount',
      ])
      .groupBy('product.id')
      .orderBy('product.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const productStats = products.map((product: any) => ({
      id: product.id,
      name: product.name_ru,
      slug: product.slug,
      price: parseFloat(product.base_price),
      stockQuantity: product.stock_quantity,
      salesCount: parseInt(product.salesCount) || 0,
      averageRating: parseFloat(product.averageRating) || 0,
      reviewsCount: parseInt(product.reviewsCount) || 0,
      isActive: product.is_active,
    }));

    return { products: productStats, total };
  }

  async getAllUsers(
    limit = 50,
    offset = 0,
    search?: string,
  ): Promise<{ users: AdminUserResponseDto[]; total: number }> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'order')
      .addSelect([
        'COUNT(order.id) as ordersCount',
        'COALESCE(SUM(order.total_amount), 0) as totalSpent',
      ])
      .groupBy('user.id')
      .orderBy('user.created_at', 'DESC');

    if (search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const adminUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isVerified: user.isVerified,
      ordersCount: parseInt(user.ordersCount) || 0,
      totalSpent: parseFloat(user.totalSpent) || 0,
      createdAt: user.createdAt,
      lastActivity: user.updatedAt,
    }));

    return { users: adminUsers, total };
  }

  async updateUserStatus(
    userId: number,
    updateDto: UpdateUserStatusDto,
  ): Promise<AdminUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    user.isActive = updateDto.isActive;
    await this.userRepository.save(user);

    // Получаем обновленную статистику пользователя
    const userStats = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'order')
      .addSelect([
        'COUNT(order.id) as ordersCount',
        'COALESCE(SUM(order.total_amount), 0) as totalSpent',
      ])
      .where('user.id = :id', { id: userId })
      .groupBy('user.id')
      .getOne();

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isVerified: user.isVerified,
      ordersCount: (userStats as any)?.ordersCount || 0,
      totalSpent: (userStats as any)?.totalSpent || 0,
      createdAt: user.createdAt,
      lastActivity: user.updatedAt,
    };
  }

  async getAllProducts(
    limit = 50,
    offset = 0,
    search?: string,
  ): Promise<{ products: AdminProductManagementDto[]; total: number }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoin('product.reviews', 'review', 'review.is_approved = :approved', {
        approved: true,
      })
      .leftJoin('product.orderItems', 'orderItem')
      .addSelect([
        'COUNT(DISTINCT orderItem.id) as salesCount',
        'AVG(review.rating) as averageRating',
        'COUNT(DISTINCT review.id) as reviewsCount',
      ])
      .groupBy('product.id, category.id, brand.id')
      .orderBy('product.created_at', 'DESC');

    if (search) {
      queryBuilder.where(
        '(product.name_ru LIKE :search OR product.name_en LIKE :search OR product.slug LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [products, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const adminProducts = products.map((product: any) => ({
      id: product.id,
      nameRu: product.name_ru,
      nameEn: product.name_en,
      slug: product.slug,
      basePrice: parseFloat(product.base_price),
      salePrice: product.sale_price ? parseFloat(product.sale_price) : 0,
      stockQuantity: product.stock_quantity,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      categoryName: product.category?.nameRu || 'Без категории',
      brandName: product.brand?.name || 'Без бренда',
      salesCount: parseInt(product.salesCount) || 0,
      averageRating: parseFloat(product.averageRating) || 0,
      reviewsCount: parseInt(product.reviewsCount) || 0,
      createdAt: product.created_at,
    }));

    return { products: adminProducts, total };
  }

  async getPendingReviews(limit = 20, offset = 0) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { isApproved: false },
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return {
      reviews: reviews.map((review) => ({
        id: review.id,
        productId: review.product.id,
        productName: review.product.name_ru,
        userId: review.user.id,
        userName: `${review.user.firstName} ${review.user.lastName}`,
        userEmail: review.user.email,
        rating: review.rating,
        title: review.titleRu || review.titleEn,
        comment: review.contentRu || review.contentEn,
        pros: review.prosRu || review.prosEn,
        cons: review.consRu || review.consEn,
        createdAt: review.createdAt,
      })),
      total,
    };
  }

  async approveReview(reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    review.isApproved = true;
    await this.reviewRepository.save(review);
  }

  async rejectReview(reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    await this.reviewRepository.remove(review);
  }
}
