import { ConsoleLogger } from '@nestjs/common';
import * as process from 'node:process';
import 'dotenv/config';

const LOG_LEVEL = Number(process.env.LOG_LEVELS) + 1;

export class CustomLogger extends ConsoleLogger {
  constructor() {
    super();
  }

  log(message: any, context?: string) {
    super.log(message, context);
  }

  error(message: any, context?: string) {
    if (LOG_LEVEL < 2) return;
    super.error(message, context);
  }

  warn(message: any, context?: string) {
    if (LOG_LEVEL < 3) return;
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    if (LOG_LEVEL < 4) return;
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    if (LOG_LEVEL < 5) return;
    super.verbose(message, context);
  }
}
