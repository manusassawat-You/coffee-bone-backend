import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('checkout')
  checkout(@CurrentUser('sub') userId: string, @Body() data: CheckoutDto) {
    return this.orderService.checkout(userId, data);
  }

  @Get()
  getOrders(@CurrentUser('sub') userId: string) {
    return this.orderService.getOrders(userId);
  }
}
