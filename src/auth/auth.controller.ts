import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { UserWithoutPassword } from 'src/user/types/user.type';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from 'src/types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);

    return {
      message: 'User created successfully',
    };
  }

  // login
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: UserWithoutPassword;
    expiresIn: number;
  }> {
    return this.authService.login(loginDto);
  }

  // ⭐ check login
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: JwtPayload): JwtPayload {
    return user;
  }
}
