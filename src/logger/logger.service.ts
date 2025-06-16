import { ConsoleLogger } from '@nestjs/common';
import * as process from 'node:process';
import 'dotenv/config';
import { saveToLog } from '../utils/logger';

const LOG_LEVEL = Number(process.env.LOG_LEVELS) + 1;

export class CustomLogger extends ConsoleLogger {
  constructor() {
    super();
  }

  async log(message: any, context?: string) {
    super.log(message, context);
    await saveToLog(message, 'log');
  }

  async error(message: any, context?: string) {
    if (LOG_LEVEL < 2) return;
    super.error(message, context);
    await saveToLog(message, 'error');
  }

  async warn(message: any, context?: string) {
    if (LOG_LEVEL < 3) return;
    super.warn(message, context);
    await saveToLog(message, 'error');
  }

  async debug(message: any, context?: string) {
    if (LOG_LEVEL < 4) return;
    super.debug(message, context);
    await saveToLog(message, 'error');
  }

  async verbose(message: any, context?: string) {
    if (LOG_LEVEL < 5) return;
    super.verbose(message, context);
    await saveToLog(message, 'error');
  }
}
