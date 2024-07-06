import { Module } from '@nestjs/common';
import { UserService } from './services';
import { UserController } from './controllers';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
