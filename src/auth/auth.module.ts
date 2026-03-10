import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { SecurityModule } from 'src/shared/security/security.module';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigOptions } from './config/jwt.config';

@Module({
  imports: [
    UserModule,
    SecurityModule,
    JwtModule.registerAsync(jwtConfigOptions),
  ],
  providers: [AuthService, AuthTokenService],
  controllers: [AuthController],
  exports: [AuthTokenService],
})
export class AuthModule {}
