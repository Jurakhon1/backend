import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions, Permission } from '../auth/decorators/permissions.decorator';
import { UserRole } from '../entities/user.entity';
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

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Получить статистику для админ панели' })
  @ApiResponse({
    status: 200,
    description: 'Статистика системы',
    type: AdminStatsDto,
  })
  async getDashboardStats(): Promise<AdminStatsDto> {
    return await this.adminService.getDashboardStats();
  }

  @Get('users/stats')
  @ApiOperation({ summary: 'Получить статистику пользователей' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика пользователей',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserStatsDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async getUserStats(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return await this.adminService.getUserStats(limit || 20, offset || 0);
  }

  @Get('products/stats')
  @ApiOperation({ summary: 'Получить статистику товаров' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика товаров',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductStatsDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async getProductStats(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return await this.adminService.getProductStats(limit || 20, offset || 0);
  }

  @Get('users')
  @Permissions(Permission.USERS_READ)
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Поиск по имени/email',
  })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/AdminUserResponseDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async getAllUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAllUsers(
      limit || 50,
      offset || 0,
      search,
    );
  }

  @Patch('users/:id/status')
  @ApiOperation({
    summary: 'Изменить статус пользователя (заблокировать/разблокировать)',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Статус пользователя обновлен',
    type: AdminUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserStatusDto,
  ): Promise<AdminUserResponseDto> {
    return await this.adminService.updateUserStatus(id, updateDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Получить список всех товаров для управления' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Поиск по названию/slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Список товаров',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/AdminProductManagementDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async getAllProducts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAllProducts(
      limit || 50,
      offset || 0,
      search,
    );
  }

  @Get('reviews/pending')
  @ApiOperation({ summary: 'Получить отзывы на модерации' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество записей',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiResponse({
    status: 200,
    description: 'Отзывы на модерации',
    schema: {
      type: 'object',
      properties: {
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              productId: { type: 'number' },
              productName: { type: 'string' },
              userId: { type: 'number' },
              userName: { type: 'string' },
              userEmail: { type: 'string' },
              rating: { type: 'number' },
              title: { type: 'string' },
              comment: { type: 'string' },
              pros: { type: 'string' },
              cons: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  async getPendingReviews(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return await this.adminService.getPendingReviews(limit || 20, offset || 0);
  }

  @Post('reviews/:id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Одобрить отзыв' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({ status: 204, description: 'Отзыв одобрен' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  async approveReview(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.adminService.approveReview(id);
  }

  @Delete('reviews/:id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отклонить отзыв (удалить)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID отзыва' })
  @ApiResponse({ status: 204, description: 'Отзыв отклонен и удален' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  async rejectReview(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.adminService.rejectReview(id);
  }
}
