import { Module } from '@nestjs/common';
import { CoreModule } from './core';
import { APIModule } from '@/api';

@Module({
  imports: [
    CoreModule,
    APIModule
  ],
})
export class AppModule {}
