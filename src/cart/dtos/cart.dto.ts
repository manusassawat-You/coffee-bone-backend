import { IsInt, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  menuId: string;

  @IsString()
  coffeeBeanId: string;

  @IsInt()
  quantity: number;
}
