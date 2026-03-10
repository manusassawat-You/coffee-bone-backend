import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/cart.dto';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@CurrentUser('sub') userId: string, @Body() data: AddToCartDto) {
    return this.cartService.addToCart(userId, data);
  }

  @Get()
  getCart(@CurrentUser('sub') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete(':id')
  removeCartItem(@Param('id') id: string) {
    return this.cartService.removeCartItem(id);
  }

  @Patch('item/:id')
  updateQuantity(@Param('id') id: string, @Body() data: UpdateCartDto) {
    return this.cartService.updateQuantity(id, data.quantity);
  }
}
