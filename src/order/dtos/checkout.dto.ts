import { IsDateString, IsEnum } from 'class-validator';

export class CheckoutDto {
  @IsDateString()
  pickupTime: string;

  @IsEnum(['QR', 'CASH'])
  paymentMethod: string;
}
