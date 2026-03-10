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
        data: {
          userId,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuId: data.menuId,
        coffeeBeanId: data.coffeeBeanId,
        quantity: data.quantity,
      },
    });
  }

  async getCart(userId: string) {
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

    if (!cart) return null;

    const items = cart.cartItems.map((item) => ({
      id: item.id,
      menu: item.menu.menuName,
      price: item.menu.price,
      quantity: item.quantity,
      total: item.menu.price * item.quantity,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

    return {
      cartId: cart.id,
      items,
      totalPrice,
    };
  }

  async removeCartItem(cartItemId: string) {
    return this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }

  async updateQuantity(cartItemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }
}
