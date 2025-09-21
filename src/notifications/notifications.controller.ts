import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationResponseDto,
  NotificationStatsDto,
} from './dto/notification-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить уведомления пользователя' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Количество уведомлений',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Смещение',
  })
  @ApiQuery({
    name: 'unreadOnly',
    required: false,
    type: 'boolean',
    description: 'Только непрочитанные',
  })
  @ApiResponse({
    status: 200,
    description: 'Список уведомлений пользователя',
    schema: {
      type: 'object',
      properties: {
        notifications: {
          type: 'array',
          items: { $ref: '#/components/schemas/NotificationResponseDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async getUserNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return await this.notificationsService.getUserNotifications(
      user.id,
      limit || 20,
      offset || 0,
      unreadOnly || false,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику уведомлений пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Статистика уведомлений',
    type: NotificationStatsDto,
  })
  async getUserNotificationStats(
    @CurrentUser() user: any,
  ): Promise<NotificationStatsDto> {
    return await this.notificationsService.getUserNotificationStats(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Отметить уведомление как прочитанное' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID уведомления' })
  @ApiResponse({
    status: 200,
    description: 'Уведомление отмечено как прочитанное',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Уведомление не найдено' })
  async markAsRead(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationResponseDto> {
    return await this.notificationsService.markAsRead(user.id, id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отметить все уведомления как прочитанные' })
  @ApiResponse({
    status: 204,
    description: 'Все уведомления отмечены как прочитанные',
  })
  async markAllAsRead(@CurrentUser() user: any): Promise<void> {
    return await this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить уведомление' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID уведомления' })
  @ApiResponse({ status: 204, description: 'Уведомление удалено' })
  @ApiResponse({ status: 404, description: 'Уведомление не найдено' })
  async deleteNotification(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.notificationsService.deleteNotification(user.id, id);
  }

  // Административные методы для создания уведомлений
  @Post('admin/create')
  @ApiOperation({ summary: 'Создать уведомление для пользователя (админ)' })
  @ApiResponse({
    status: 201,
    description: 'Уведомление создано',
    type: NotificationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async createNotification(
    @Body() createDto: CreateNotificationDto & { userId: number },
  ): Promise<NotificationResponseDto> {
    return await this.notificationsService.createNotification(
      createDto.userId,
      createDto,
    );
  }

  @Post('admin/bulk')
  @ApiOperation({ summary: 'Создать массовое уведомление (админ)' })
  @ApiResponse({
    status: 201,
    description: 'Уведомления созданы',
    type: [NotificationResponseDto],
  })
  async createBulkNotification(
    @Body() createDto: CreateNotificationDto & { userIds: number[] },
  ): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.createBulkNotification(
      createDto.userIds,
      createDto,
    );
  }

  @Post('admin/promotion')
  @ApiOperation({ summary: 'Отправить промо-уведомление (админ)' })
  @ApiResponse({
    status: 201,
    description: 'Промо-уведомления отправлены',
    type: [NotificationResponseDto],
  })
  async sendPromotionNotification(
    @Body()
    data: {
      userIds: number[];
      title: string;
      message: string;
      promoCode?: string;
    },
  ): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.sendPromotionNotification(
      data.userIds,
      data.title,
      data.message,
      data.promoCode,
    );
  }
}
