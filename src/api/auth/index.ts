import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { expiresIn, jwtSecret } from '@/config';
import { UserService } from '../user/services';
import { UserModule } from '../user';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
})
export class AuthModule {}
