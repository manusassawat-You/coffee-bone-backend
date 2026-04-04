import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import type { JwtPayload } from 'src/types/jwt-payload.type';
import { UserWithoutPassword } from 'src/user/types/user.type';

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

  @Get('me')
  getMe(@CurrentUser() user: JwtPayload): JwtPayload {
    return user;
  }
}
