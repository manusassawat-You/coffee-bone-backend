import { IsDateString, IsEnum } from 'class-validator';

export enum PaymentMethod {
  QR = 'QR',
  CASH = 'CASH',
}

export class CheckoutDto {
  @IsDateString()
  pickupTime: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
