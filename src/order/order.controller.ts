import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { OrderStatus } from 'src/database/generated/prisma/enums';

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

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.orderService.updateStatus(id, body.status);
  }
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
