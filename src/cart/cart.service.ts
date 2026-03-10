import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddToCartDto } from './dtos/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, data: AddToCartDto) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuId: data.menuId,
        quantity: data.quantity,
      },
    });

    if (data.addons?.length) {
      await this.prisma.cartItemAddon.createMany({
        data: data.addons.map((addonId) => ({
          cartItemId: cartItem.id,
          addonId,
        })),
      });
    }

    return cartItem;
  }

  async getCart(userId: string) {
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

    if (!cart) {
      return {
        cartId: null,
        items: [],
        totalPrice: 0,
      };
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-call */

    const items = cart.cartItems.map((item: any) => {
      const addonPrice = item.addons.reduce(
        (sum: number, a: any) => sum + a.addon.price,
        0,
      );

      const price = item.menu.price + addonPrice;

      return {
        id: item.id,
        menu: item.menu.menuName,
        quantity: item.quantity,
        addons: item.addons.map((a: any) => ({
          id: a.addon.id,
          title: a.addon.title,
          price: a.addon.price,
        })),
        price,
        total: price * item.quantity,
      };
    });

    const totalPrice = items.reduce(
      (sum: number, item: any) => sum + item.total,
      0,
    );

    return {
      cartId: cart.id,
      items,
      totalPrice,
    };
  }

  async removeCartItem(cartItemId: string) {
    await this.prisma.cartItemAddon.deleteMany({
      where: { cartItemId },
    });

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }
}
