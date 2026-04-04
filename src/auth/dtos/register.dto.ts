import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class RegisterDto {
  @Trim()
  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  username: string;

  @Trim()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @Trim()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
