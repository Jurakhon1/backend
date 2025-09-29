import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource, IsNull } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderResponseDto,
  OrderItemResponseDto,
} from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    private dataSource: DataSource,
  ) {}

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Используем транзакцию для предотвращения race condition
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Устанавливаем более длительное время ожидания блокировки
      await transactionalEntityManager.query('SET SESSION innodb_lock_wait_timeout = 60');
      // Проверяем пользователя
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Сначала очищаем просроченные заказы для этого пользователя
      await this.cleanupUserExpiredOrders(transactionalEntityManager, userId);
      
      // Проверяем, не создавался ли заказ недавно (защита от дублирования)
      const recentOrder = await transactionalEntityManager.findOne(Order, {
        where: { 
          user: { id: userId },
          status: OrderStatus.PENDING_PAYMENT,
        },
        order: { created_at: 'DESC' },
      });

      if (recentOrder) {
        const timeDiff = Date.now() - new Date(recentOrder.created_at).getTime();
        console.log(`OrdersService: Найден недавний заказ ${recentOrder.id} для пользователя ${userId}`);
        console.log(`OrdersService: Время создания: ${recentOrder.created_at}`);
        console.log(`OrdersService: Разница во времени: ${timeDiff}ms (${Math.round(timeDiff/1000)} секунд)`);
        console.log(`OrdersService: Статус заказа: ${recentOrder.status}`);
        
        // Проверяем, не истек ли срок оплаты старого заказа
        const isExpired = recentOrder.paymentDeadline && recentOrder.paymentDeadline < new Date();
        
        if (isExpired) {
          console.log(`OrdersService: Старый заказ ${recentOrder.id} просрочен, отменяем его`);
          // Отменяем просроченный заказ
          recentOrder.status = OrderStatus.PAYMENT_EXPIRED;
          recentOrder.paymentStatus = PaymentStatus.FAILED;
          await transactionalEntityManager.save(recentOrder);
          
          // Возвращаем товары на склад
          for (const item of recentOrder.items || []) {
            await transactionalEntityManager.query(
              'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
              [item.quantity, item.product.id]
            );
          }
          console.log(`OrdersService: Просроченный заказ отменен, продолжаем создание нового`);
        } else if (timeDiff < 60000) { // 1 минута - уменьшили время блокировки
          console.log(`OrdersService: Блокируем создание заказа - есть активный заказ ${recentOrder.id}`);
          throw new ConflictException('У вас уже есть заказ в обработке. Завершите оплату текущего заказа или дождитесь его отмены.');
        } else {
          console.log(`OrdersService: Старый заказ слишком старый, продолжаем создание нового`);
        }
      } else {
        console.log(`OrdersService: Недавних заказов для пользователя ${userId} не найдено`);
      }

      // Получаем товары из корзины
      const cartItems = await transactionalEntityManager.find(CartItem, {
        where: { user: { id: userId } },
        relations: ['product'],
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('Корзина пуста. Добавьте товары в корзину перед созданием заказа.');
      }

      // Проверяем наличие товаров на складе с блокировкой для чтения
      for (const cartItem of cartItems) {
        const product = await transactionalEntityManager.findOne(Product, {
          where: { id: cartItem.product.id },
          lock: { mode: 'pessimistic_read' },
        });
        
        if (!product || product.stock_quantity < cartItem.quantity) {
          throw new ConflictException(
            `Недостаточно товара "${cartItem.product.name_ru}" на складе`,
          );
        }
      }

      // Рассчитываем стоимость
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shippingCost = createOrderDto.delivery_type === 'delivery' ? 500 : 0; // Примерная стоимость доставки
      const discountAmount = createOrderDto.bonus_points_used ?? 0;
      const totalAmount = subtotal + shippingCost - discountAmount;
      const prepaidAmount = Math.round(totalAmount * 0.1 * 100) / 100; // 10% предоплата
      const remainingAmount = totalAmount - prepaidAmount;

      // Создаем номер заказа
      let orderNumber = await this.generateOrderNumber();

      // Устанавливаем срок оплаты (30 минут)
      const paymentDeadline = new Date();
      paymentDeadline.setMinutes(paymentDeadline.getMinutes() + 30);

      // Создаем заказ с retry логикой для уникального номера
      let savedOrder;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const order = transactionalEntityManager.create(Order, {
            orderNumber: orderNumber,
            user,
            status: OrderStatus.PENDING_PAYMENT,
            paymentStatus: PaymentStatus.PENDING,
            deliveryType: createOrderDto.delivery_type,
            shippingAddress: createOrderDto.shipping_address || undefined,
            subtotal,
            shippingCost: shippingCost,
            discountAmount: discountAmount,
            bonusPointsUsed: createOrderDto.bonus_points_used ?? 0,
            totalAmount: totalAmount,
            prepaidAmount: prepaidAmount,
            remainingAmount: remainingAmount,
            paymentDeadline: paymentDeadline,
            notes: createOrderDto.notes || undefined,
          });

          savedOrder = await transactionalEntityManager.save(order);
          break; // Успешно создан, выходим из цикла
        } catch (error) {
          attempts++;
          console.log(`OrdersService: Попытка ${attempts} создания заказа с номером ${orderNumber} неудачна:`, error.message);
          
          if (attempts >= maxAttempts) {
            throw error; // Превышено количество попыток
          }
          
          // Генерируем новый номер для следующей попытки
          orderNumber = await this.generateOrderNumber();
          console.log(`OrdersService: Генерируем новый номер заказа: ${orderNumber}`);
        }
      }

      // Создаем позиции заказа
      const orderItems = cartItems.map((cartItem) =>
        transactionalEntityManager.create(OrderItem, {
          order: savedOrder,
          product: cartItem.product,
          product_name_ru: cartItem.product.name_ru,
          product_name_en: cartItem.product.name_en,
          quantity: cartItem.quantity,
          unit_price: cartItem.price,
          total_price: cartItem.price * cartItem.quantity,
        }),
      );

      await transactionalEntityManager.save(orderItems);

      // Резервируем товары (уменьшаем количество на складе) - ВНУТРИ транзакции
      // Сортируем по ID продукта для предотвращения deadlock'ов
      const sortedCartItems = [...cartItems].sort((a, b) => a.product.id - b.product.id);
      
      for (const cartItem of sortedCartItems) {
        const result = await transactionalEntityManager.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
          [cartItem.quantity, cartItem.product.id, cartItem.quantity]
        );
        
        if (result.affectedRows === 0) {
          throw new ConflictException(
            `Недостаточно товара "${cartItem.product.name_ru}" на складе для резервирования`,
          );
        }
      }

      // Очищаем корзину
      await transactionalEntityManager.delete(CartItem, { user: { id: userId } });

      return this.buildOrderResponse(savedOrder, orderItems);
    });
  }

  async getOrder(userId: number, orderId: number): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return this.buildOrderResponse(order, order.items);
  }

  async getUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });

    return orders.map((order) => this.buildOrderResponse(order, order.items));
  }

  async confirmPayment(orderId: number): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new ConflictException('Заказ уже обработан');
    }

    // Обновляем статус заказа
    order.status = OrderStatus.PAYMENT_CONFIRMED;
    order.paymentStatus = PaymentStatus.PREPAID;

    const updatedOrder = await this.ordersRepository.save(order);

    return this.buildOrderResponse(updatedOrder, order.items);
  }

  async cancelExpiredOrders(): Promise<void> {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 минут назад
    
    // Находим заказы, которые либо просрочены по deadline, либо старше 5 минут без deadline
    const expiredOrders = await this.ordersRepository.find({
      where: [
        {
          status: OrderStatus.PENDING_PAYMENT,
          paymentDeadline: LessThan(now),
        },
        {
          status: OrderStatus.PENDING_PAYMENT,
          paymentDeadline: IsNull(),
          created_at: LessThan(fiveMinutesAgo),
        }
      ],
      relations: ['items', 'items.product'],
    });

    console.log(`OrdersService: Проверяем ${expiredOrders.length} заказов на истечение срока`);

    for (const order of expiredOrders) {
      const isDeadlineExpired = order.paymentDeadline && order.paymentDeadline < now;
      const isTooOld = !order.paymentDeadline && order.created_at < fiveMinutesAgo;
      
      if (isDeadlineExpired || isTooOld) {
        console.log(`OrdersService: Отменяем ${isDeadlineExpired ? 'просроченный' : 'старый'} заказ ${order.id}`);
        // Отменяем заказ
        order.status = OrderStatus.PAYMENT_EXPIRED;
        order.paymentStatus = PaymentStatus.FAILED;

        await this.ordersRepository.save(order);

        // Возвращаем товары на склад
        for (const item of order.items) {
          await this.unreserveProduct(item.product.id, item.quantity);
        }
      }
    }
  }

  // Очистка просроченных заказов для конкретного пользователя
  private async cleanupUserExpiredOrders(transactionalEntityManager: any, userId: number): Promise<void> {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const expiredOrders = await transactionalEntityManager.find(Order, {
      where: [
        {
          user: { id: userId },
          status: OrderStatus.PENDING_PAYMENT,
          paymentDeadline: LessThan(now),
        },
        {
          user: { id: userId },
          status: OrderStatus.PENDING_PAYMENT,
          paymentDeadline: IsNull(),
          created_at: LessThan(fiveMinutesAgo),
        }
      ],
      relations: ['items', 'items.product'],
    });

    for (const order of expiredOrders) {
      console.log(`OrdersService: Очищаем просроченный заказ ${order.id} для пользователя ${userId}`);
      order.status = OrderStatus.PAYMENT_EXPIRED;
      order.paymentStatus = PaymentStatus.FAILED;
      await transactionalEntityManager.save(order);

      // Возвращаем товары на склад
      for (const item of order.items) {
        await transactionalEntityManager.query(
          'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }
    }
  }

  // Новый метод для очистки "зависших" заказов (старше 1 минуты)
  async cleanupStuckOrders(): Promise<void> {
    const oneMinuteAgo = new Date(Date.now() - 60000); // 1 минута назад
    
    const stuckOrders = await this.ordersRepository.find({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
        created_at: LessThan(oneMinuteAgo),
      },
      relations: ['items', 'items.product'],
    });

    console.log(`OrdersService: Найдено ${stuckOrders.length} "зависших" заказов`);

    for (const order of stuckOrders) {
      console.log(`OrdersService: Очищаем зависший заказ ${order.id} (создан ${order.created_at})`);
      
      // Отменяем заказ
      order.status = OrderStatus.PAYMENT_EXPIRED;
      order.paymentStatus = PaymentStatus.FAILED;

      await this.ordersRepository.save(order);

      // Возвращаем товары на склад
      for (const item of order.items) {
        await this.unreserveProduct(item.product.id, item.quantity);
      }
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const timestamp = Date.now().toString().slice(-6); // Добавляем timestamp для уникальности

    // Получаем последний номер за сегодня
    const lastOrder = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.orderNumber LIKE :pattern', {
        pattern: `${prefix}${datePart}%`,
      })
      .orderBy('order.orderNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-6));
      sequence = lastSequence + 1;
    }

    const sequencePart = sequence.toString().padStart(6, '0');
    return `${prefix}${datePart}${sequencePart}${timestamp}`;
  }

  private async reserveProduct(
    productId: number,
    quantity: number,
    transactionalEntityManager?: any,
  ): Promise<void> {
    const manager = transactionalEntityManager || this.ordersRepository.manager;
    await manager.query(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
      [quantity, productId, quantity],
    );
  }

  private async unreserveProduct(
    productId: number,
    quantity: number,
    transactionalEntityManager?: any,
  ): Promise<void> {
    const manager = transactionalEntityManager || this.ordersRepository.manager;
    await manager.query(
      'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
      [quantity, productId],
    );
  }

  private buildOrderResponse(
    order: Order,
    items: OrderItem[],
  ): OrderResponseDto {
    const orderItems: OrderItemResponseDto[] = items.map((item) => ({
      id: item.id,
      product: {
        id: item.product.id,
        name_ru: item.product.name_ru,
        name_en: item.product.name_en,
        slug: item.product.slug,
      },
      product_name_ru: item.product_name_ru,
      product_name_en: item.product_name_en,
      variant_info_ru: item.variant_info_ru,
      variant_info_en: item.variant_info_en,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    return new OrderResponseDto({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      payment_status: order.paymentStatus,
      delivery_type: order.deliveryType,
      shipping_address: order.shippingAddress,
      subtotal: order.subtotal,
      tax_amount: order.taxAmount,
      shipping_cost: order.shippingCost,
      discount_amount: order.discountAmount,
      bonus_points_used: order.bonusPointsUsed,
      total_amount: order.totalAmount,
      prepaid_amount: order.prepaidAmount,
      remaining_amount: order.remainingAmount,
      payment_deadline: order.paymentDeadline,
      notes: order.notes,
      tracking_number: order.trackingNumber,
      estimated_delivery_date: order.estimatedDeliveryDate,
      actual_delivery_date: order.actualDeliveryDate,
      items: orderItems,
      created_at: order.created_at,
      updated_at: order.updated_at,
    });
  }
}
