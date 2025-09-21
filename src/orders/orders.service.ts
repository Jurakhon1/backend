import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import { CartItem } from '../entities/cart-item.entity';
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
  ) {}

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Проверяем пользователя
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Получаем товары из корзины
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Корзина пуста');
    }

    // Проверяем наличие товаров на складе
    for (const cartItem of cartItems) {
      if (cartItem.product.stock_quantity < cartItem.quantity) {
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
    const discountAmount = createOrderDto.bonus_points_used || 0;
    const totalAmount = subtotal + shippingCost - discountAmount;
    const prepaidAmount = Math.round(totalAmount * 0.1 * 100) / 100; // 10% предоплата
    const remainingAmount = totalAmount - prepaidAmount;

    // Создаем номер заказа
    const orderNumber = await this.generateOrderNumber();

    // Устанавливаем срок оплаты (30 минут)
    const paymentDeadline = new Date();
    paymentDeadline.setMinutes(paymentDeadline.getMinutes() + 30);

    // Создаем заказ
    const order = this.ordersRepository.create({
      orderNumber: orderNumber,
      user,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      deliveryType: createOrderDto.delivery_type,
      shippingAddress: createOrderDto.shipping_address,
      subtotal,
      shippingCost: shippingCost,
      discountAmount: discountAmount,
      bonusPointsUsed: createOrderDto.bonus_points_used || 0,
      totalAmount: totalAmount,
      prepaidAmount: prepaidAmount,
      remainingAmount: remainingAmount,
      paymentDeadline: paymentDeadline,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Создаем позиции заказа
    const orderItems = cartItems.map((cartItem) =>
      this.orderItemsRepository.create({
        order: savedOrder,
        product: cartItem.product,
        product_name_ru: cartItem.product.name_ru,
        product_name_en: cartItem.product.name_en,
        quantity: cartItem.quantity,
        unit_price: cartItem.price,
        total_price: cartItem.price * cartItem.quantity,
      }),
    );

    await this.orderItemsRepository.save(orderItems);

    // Очищаем корзину
    await this.cartRepository.delete({ user: { id: userId } });

    // Резервируем товары (уменьшаем количество на складе)
    for (const cartItem of cartItems) {
      await this.reserveProduct(cartItem.product.id, cartItem.quantity);
    }

    return this.buildOrderResponse(savedOrder, orderItems);
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
    const expiredOrders = await this.ordersRepository.find({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
      },
      relations: ['items', 'items.product'],
    });

    const now = new Date();

    for (const order of expiredOrders) {
      if (order.paymentDeadline && order.paymentDeadline < now) {
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

  private async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');

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
    return `${prefix}${datePart}${sequencePart}`;
  }

  private async reserveProduct(
    productId: number,
    quantity: number,
  ): Promise<void> {
    await this.ordersRepository.manager.query(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
      [quantity, productId],
    );
  }

  private async unreserveProduct(
    productId: number,
    quantity: number,
  ): Promise<void> {
    await this.ordersRepository.manager.query(
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
      tracking_number: order.tracking_number,
      estimated_delivery_date: order.estimated_delivery_date,
      actual_delivery_date: order.actual_delivery_date,
      items: orderItems,
      created_at: order.created_at,
      updated_at: order.updated_at,
    });
  }
}
