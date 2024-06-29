import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import corsOptions from 'config/corsOptions';
import { setCorsArray } from 'config/corsOptions';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import fs from 'node:fs';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setCorsArray(process.env.CORS_URL);
  app.enableCors(corsOptions);
  await app.listen(3333);
}
bootstrap();
