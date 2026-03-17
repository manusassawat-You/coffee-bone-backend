import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class LoginDto {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @Trim()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
