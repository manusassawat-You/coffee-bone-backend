import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AddonType } from 'src/database/generated/prisma/enums';

export class CreateAddonDto {
  @IsEnum(AddonType)
  type: AddonType;

  @IsString()
  title: string;

  @IsNumber()
  price: number;
}
