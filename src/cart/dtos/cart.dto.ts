import { IsArray, IsInt, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  menuId: string;

  @IsInt()
  quantity: number;

  @IsArray()
  addons: string[];
}
