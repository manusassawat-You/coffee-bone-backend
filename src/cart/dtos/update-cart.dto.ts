import { IsInt } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  quantity: number;
}
