import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import * as process from 'node:process';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { parse } from 'yaml';
import { CustomLogger } from './logger/logger.service';
import { CustomExceptionFilter } from './logger/exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.useGlobalPipes(new ValidationPipe());

  const api = await readFile(
    path.resolve(process.cwd(), 'doc/api.yaml'),
    'utf-8',
  );

  const logger = new Logger('Exceptions');
  process.on('uncaughtException', async (error) => {
    logger.error(error);
  });
  process.on('unhandledRejection', async (reason) => {
    logger.error(reason);
  });
  app.useGlobalFilters(new CustomExceptionFilter());

  SwaggerModule.setup('doc', app, parse(api));

  await app.listen(port);
}
bootstrap();
