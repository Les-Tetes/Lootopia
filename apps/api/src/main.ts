import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

function resolvePort(rawPort: string | undefined): number {
  const port = Number(rawPort);
  return Number.isSafeInteger(port) && port > 0 ? port : DEFAULT_PORT;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const port = resolvePort(process.env['PORT']);
  await app.listen(port);
  Logger.log(`API listening on port ${String(port)}`, 'Bootstrap');
}

void bootstrap();
