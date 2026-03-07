import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SecurityModule } from 'src/shared/security/security.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [SecurityModule, DatabaseModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
