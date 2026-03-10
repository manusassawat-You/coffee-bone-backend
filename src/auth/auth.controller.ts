import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { UserWithoutPassword } from 'src/user/types/user.type';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);

    return {
      message: 'User created successfully',
    };
  }
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: UserWithoutPassword;
    expiresIn: number;
  }> {
    return this.authService.login(loginDto);
  }
}
