import { BadRequestException, Injectable } from '@nestjs/common';
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
            addons: {
              include: {
                addon: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalPrice = cart.cartItems.reduce((sum, item) => {
      const addonPrice = item.addons.reduce((s, a) => s + a.addon.price, 0);

      const price = item.menu.price + addonPrice;

      return sum + price * item.quantity;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
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

      for (const item of cart.cartItems) {
        const addonPrice = item.addons.reduce((s, a) => s + a.addon.price, 0);

        const itemPrice = item.menu.price + addonPrice;

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            menuId: item.menuId,
            quantity: item.quantity,
            price: itemPrice,
          },
        });

        if (item.addons.length > 0) {
          await tx.orderItemAddon.createMany({
            data: item.addons.map((a) => ({
              orderItemId: orderItem.id,
              addonId: a.addonId,
            })),
          });
        }
      }

      await tx.cartItemAddon.deleteMany({
        where: {
          cartItem: {
            cartId: cart.id,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    });
  }

  async getOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menu: true,
            addons: {
              include: {
                addon: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
