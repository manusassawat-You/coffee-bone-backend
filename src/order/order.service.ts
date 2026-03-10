import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CheckoutDto } from './dtos/checkout.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, data: CheckoutDto) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const totalPrice = cart.cartItems.reduce(
      (sum, item) => sum + item.menu.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        pickupTime: new Date(data.pickupTime),
        status: 'PENDING',
        method: data.paymentMethod,
        amount: totalPrice,
        paymentStatus: 'UNPAID',
      },
    });

    // create order items
    await this.prisma.orderItem.createMany({
      data: cart.cartItems.map((item) => ({
        orderId: order.id,
        menuId: item.menuId,
        coffeeBeanId: item.coffeeBeanId,
        quantity: item.quantity,
        price: item.menu.price,
      })),
    });

    // clear cart
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  }
  async getOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
