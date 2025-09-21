import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull } from 'typeorm';
import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationResponseDto,
  NotificationStatsDto,
} from './dto/notification-response.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: number,
    createDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const notification = this.notificationRepository.create({
      user,
      type: createDto.type,
      titleRu: createDto.titleRu,
      titleEn: createDto.titleEn,
      messageRu: createDto.messageRu,
      messageEn: createDto.messageEn,
      data: createDto.data,
      scheduledAt: createDto.scheduledAt,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);
    return this.mapToResponseDto(savedNotification);
  }

  async createBulkNotification(
    userIds: number[],
    createDto: CreateNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    const users = await this.userRepository.findByIds(userIds);

    if (users.length === 0) {
      throw new NotFoundException('Пользователи не найдены');
    }

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        user,
        type: createDto.type,
        titleRu: createDto.titleRu,
        titleEn: createDto.titleEn,
        messageRu: createDto.messageRu,
        messageEn: createDto.messageEn,
        data: createDto.data,
        scheduledAt: createDto.scheduledAt,
      }),
    );

    const savedNotifications =
      await this.notificationRepository.save(notifications);
    return savedNotifications.map((notification) =>
      this.mapToResponseDto(notification),
    );
  }

  async getUserNotifications(
    userId: number,
    limit = 20,
    offset = 0,
    unreadOnly = false,
  ): Promise<{ notifications: NotificationResponseDto[]; total: number }> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.user_id = :userId', { userId })
      .orderBy('notification.created_at', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.is_read = :isRead', {
        isRead: false,
      });
    }

    const [notifications, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      notifications: notifications.map((notification) =>
        this.mapToResponseDto(notification),
      ),
      total,
    };
  }

  async markAsRead(
    userId: number,
    notificationId: number,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException('Уведомление не найдено');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    const updatedNotification =
      await this.notificationRepository.save(notification);
    return this.mapToResponseDto(updatedNotification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async deleteNotification(
    userId: number,
    notificationId: number,
  ): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException('Уведомление не найдено');
    }

    await this.notificationRepository.remove(notification);
  }

  async getUserNotificationStats(
    userId: number,
  ): Promise<NotificationStatsDto> {
    const [total, unread] = await Promise.all([
      this.notificationRepository.count({ where: { user: { id: userId } } }),
      this.notificationRepository.count({
        where: { user: { id: userId }, isRead: false },
      }),
    ]);

    const pending = await this.notificationRepository.count({
      where: { user: { id: userId }, isSent: false },
    });

    return {
      total,
      unread,
      read: total - unread,
      pending,
    };
  }

  // Системные методы для отправки уведомлений
  async sendOrderStatusNotification(
    userId: number,
    orderId: number,
    status: string,
  ): Promise<NotificationResponseDto> {
    const statusMessages = {
      pending: {
        titleRu: 'Заказ получен',
        titleEn: 'Order received',
        messageRu: `Ваш заказ #${orderId} получен и ожидает обработки`,
        messageEn: `Your order #${orderId} has been received and is awaiting processing`,
      },
      processing: {
        titleRu: 'Заказ обрабатывается',
        titleEn: 'Order processing',
        messageRu: `Ваш заказ #${orderId} находится в обработке`,
        messageEn: `Your order #${orderId} is being processed`,
      },
      shipped: {
        titleRu: 'Заказ отправлен',
        titleEn: 'Order shipped',
        messageRu: `Ваш заказ #${orderId} отправлен и скоро будет доставлен`,
        messageEn: `Your order #${orderId} has been shipped and will be delivered soon`,
      },
      delivered: {
        titleRu: 'Заказ доставлен',
        titleEn: 'Order delivered',
        messageRu: `Ваш заказ #${orderId} успешно доставлен`,
        messageEn: `Your order #${orderId} has been successfully delivered`,
      },
      cancelled: {
        titleRu: 'Заказ отменен',
        titleEn: 'Order cancelled',
        messageRu: `Ваш заказ #${orderId} был отменен`,
        messageEn: `Your order #${orderId} has been cancelled`,
      },
    };

    const message = statusMessages[status] || statusMessages.pending;

    return await this.createNotification(userId, {
      type: NotificationType.ORDER_STATUS,
      titleRu: message.titleRu,
      titleEn: message.titleEn,
      messageRu: message.messageRu,
      messageEn: message.messageEn,
      data: { orderId, status },
    });
  }

  async sendPaymentConfirmationNotification(
    userId: number,
    orderId: number,
    amount: number,
  ): Promise<NotificationResponseDto> {
    return await this.createNotification(userId, {
      type: NotificationType.PAYMENT_CONFIRMATION,
      titleRu: 'Платеж подтвержден',
      titleEn: 'Payment confirmed',
      messageRu: `Платеж по заказу #${orderId} на сумму ${amount}₽ подтвержден`,
      messageEn: `Payment for order #${orderId} in the amount of ${amount}₽ has been confirmed`,
      data: { orderId, amount },
    });
  }

  async sendProductAvailableNotification(
    userId: number,
    productId: number,
    productName: string,
  ): Promise<NotificationResponseDto> {
    return await this.createNotification(userId, {
      type: NotificationType.PRODUCT_AVAILABLE,
      titleRu: 'Товар снова в наличии',
      titleEn: 'Product back in stock',
      messageRu: `Товар "${productName}" снова доступен для заказа`,
      messageEn: `Product "${productName}" is available for order again`,
      data: { productId },
    });
  }

  async sendPromotionNotification(
    userIds: number[],
    title: string,
    message: string,
    promoCode?: string,
  ): Promise<NotificationResponseDto[]> {
    return await this.createBulkNotification(userIds, {
      type: NotificationType.PROMOTION,
      titleRu: title,
      titleEn: title,
      messageRu: message,
      messageEn: message,
      data: { promoCode },
    });
  }

  async sendBonusEarnedNotification(
    userId: number,
    bonusAmount: number,
    reason: string,
  ): Promise<NotificationResponseDto> {
    return await this.createNotification(userId, {
      type: NotificationType.BONUS_EARNED,
      titleRu: 'Начислены бонусы',
      titleEn: 'Bonus points earned',
      messageRu: `Вам начислено ${bonusAmount} бонусов за ${reason}`,
      messageEn: `You have earned ${bonusAmount} bonus points for ${reason}`,
      data: { bonusAmount, reason },
    });
  }

  async sendReviewApprovedNotification(
    userId: number,
    productName: string,
    reviewId: number,
  ): Promise<NotificationResponseDto> {
    return await this.createNotification(userId, {
      type: NotificationType.REVIEW_APPROVED,
      titleRu: 'Отзыв одобрен',
      titleEn: 'Review approved',
      messageRu: `Ваш отзыв о товаре "${productName}" одобрен и опубликован`,
      messageEn: `Your review of "${productName}" has been approved and published`,
      data: { reviewId },
    });
  }

  // Получение отложенных уведомлений для отправки
  async getPendingNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: [
        { isSent: false, scheduledAt: IsNull() },
        { isSent: false, scheduledAt: LessThanOrEqual(new Date()) },
      ],
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async markAsSent(notificationId: number): Promise<void> {
    await this.notificationRepository.update(notificationId, {
      isSent: true,
      sentAt: new Date(),
    });
  }

  private mapToResponseDto(
    notification: Notification,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      type: notification.type,
      titleRu: notification.titleRu,
      titleEn: notification.titleEn,
      messageRu: notification.messageRu,
      messageEn: notification.messageEn,
      data: notification.data,
      isRead: notification.isRead,
      isSent: notification.isSent,
      sentAt: notification.sentAt,
      readAt: notification.readAt,
      scheduledAt: notification.scheduledAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
