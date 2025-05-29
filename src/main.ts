import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import * as process from 'node:process';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { parse } from 'yaml';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const api = await readFile(
    path.resolve(process.cwd(), 'doc/api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('doc', app, parse(api));

  await app.listen(port);
}
bootstrap();
