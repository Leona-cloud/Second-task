import { frontendDevOrigin, manualEnvironment } from '@/config';
import { AllExceptionsFilter } from '@/core/exception/http';
import { ValidatorPipeInstance } from '@/core/pipe';
import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { json } from 'express';
import { AppModule } from '@/modules';

export interface CreateServerOptions {
  port: number;
  production?: boolean;
  whitelistedDomains?: string[];
}

export default async (
  options: CreateServerOptions,
): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, {});

  let whitelist = options.whitelistedDomains ?? [];
  if (manualEnvironment === 'development') {
    whitelist = whitelist.concat(frontendDevOrigin as any);
  }

  const corsOption: CorsOptions = {
    origin: whitelist,
    allowedHeaders: ['Authorization', 'X-Requested-with', 'Content-Type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  };

  app.use(helmet());
  app.enableCors(corsOption);
  app.use(morgan(options.production ? 'combined' : 'dev'));
  app.use(json({ limit: '100mb' }));

  app.useGlobalPipes(ValidatorPipeInstance());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.listen(options.port);

  return app;
};
