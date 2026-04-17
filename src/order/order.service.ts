import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { OrderStatus } from 'src/database/generated/prisma/enums';
import type { CartGetPayload } from 'src/database/generated/prisma/models/Cart';

type CheckoutCart = CartGetPayload<{
  include: {
    cartItems: {
      include: {
        menu: true;
        addons: {
          include: {
            addon: true;
          };
        };
      };
    };
  };
}>;

type CheckoutCartItem = CheckoutCart['cartItems'][number];
type CheckoutCartItemAddon = CheckoutCartItem['addons'][number];
type OrderTransactionClient = Pick<
  PrismaService,
  'order' | 'orderItem' | 'orderItemAddon' | 'cartItemAddon' | 'cartItem'
>;

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

    const totalPrice = cart.cartItems.reduce(
      (sum: number, item: CheckoutCartItem) => {
        const addonPrice = item.addons.reduce(
          (s: number, a: CheckoutCartItemAddon) => s + a.addon.price,
          0,
        );

        const price = item.menu.price + addonPrice;

        return sum + price * item.quantity;
      },
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const txClient = tx as unknown as OrderTransactionClient;

      const order = await txClient.order.create({
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
        const addonPrice = item.addons.reduce(
          (s: number, a: CheckoutCartItemAddon) => s + a.addon.price,
          0,
        );

        const itemPrice = item.menu.price + addonPrice;

        const orderItem = await txClient.orderItem.create({
          data: {
            orderId: order.id,
            menuId: item.menuId,
            quantity: item.quantity,
            price: itemPrice,
          },
        });

        if (item.addons.length > 0) {
          await txClient.orderItemAddon.createMany({
            data: item.addons.map((a: CheckoutCartItemAddon) => ({
              orderItemId: orderItem.id,
              addonId: a.addonId,
            })),
          });
        }
      }

      await txClient.cartItemAddon.deleteMany({
        where: {
          cartItem: {
            cartId: cart.id,
          },
        },
      });

      await txClient.cartItem.deleteMany({
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
  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
  async deleteOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const txClient = tx as unknown as OrderTransactionClient;

      // หา order items ก่อน
      const orderItems = await txClient.orderItem.findMany({
        where: { orderId },
        select: { id: true },
      });

      const orderItemIds = orderItems.map((i: { id: string }) => i.id);

      // ลบ addon ของ orderItem
      await txClient.orderItemAddon.deleteMany({
        where: {
          orderItemId: {
            in: orderItemIds,
          },
        },
      });

      // ลบ order items
      await txClient.orderItem.deleteMany({
        where: { orderId },
      });

      // ลบ order
      return txClient.order.delete({
        where: { id: orderId },
      });
    });
  }
}
