import { Module } from '@nestjs/common';
import { OrganizationService } from './services';
import { OrganizationController } from './controllers';
import { UserModule } from '../user';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
  imports: [UserModule],
})
export class OrganizationModule {}
