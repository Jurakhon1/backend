import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get('user/:userId')
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderResponseDto[]> {
    return await this.ordersService.getUserOrders(userId);
  }

  @Get('user/:userId/:orderId')
  async getOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.getOrder(userId, orderId);
  }

  @Put(':orderId/confirm-payment')
  async confirmPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.confirmPayment(orderId);
  }

  @Post('cancel-expired')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelExpiredOrders(): Promise<void> {
    return await this.ordersService.cancelExpiredOrders();
  }
}
