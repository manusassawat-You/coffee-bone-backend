import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/database/generated/prisma/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
