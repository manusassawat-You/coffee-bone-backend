import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SecurityModule } from './shared/security/security.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [DatabaseModule, UserModule, SecurityModule, MenuModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
