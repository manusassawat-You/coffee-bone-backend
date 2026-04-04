import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SecurityModule } from './shared/security/security.module';
import { MenuModule } from './menu/menu.module';
import { AddonModule } from './addon/addon.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    SecurityModule,
    MenuModule,
    AddonModule,
    CartModule,
    OrderModule,
    AuthModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
