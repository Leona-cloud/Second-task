import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { OrganizationModule } from './organizations';

@Module({
  imports: [AuthModule, UserModule, OrganizationModule],
})
export class APIModule {}
