import 'dotenv/config';
import * as process from 'node:process';
import { readdir, mkdir, access, appendFile, stat } from 'node:fs/promises';
import * as path from 'node:path';

const LOG_SIZE = Number(process.env.LOG_SIZE) * 1000;

const LOG_DIR = path.resolve(process.cwd(), 'logs');

async function getLastLogFileName(type: 'log' | 'error') {
  await checkLogsDir();
  const files = await readdir(LOG_DIR);
  const logFiles = files
    .filter((file) => file.startsWith(type))
    .sort((a, b) => {
      const regexp = new RegExp(`${type}|.log`, 'g');
      return Number(a.replace(regexp, '')) - Number(b.replace(regexp, ''));
    });
  if (logFiles.length > 0) {
    const lastFile = logFiles[logFiles.length - 1];
    const isAvailableSize = await checkFileSize(lastFile);
    return isAvailableSize ? lastFile : nextFileName(lastFile);
  } else return `${type}1.log`;
}

async function createLogsDir() {
  await mkdir(LOG_DIR, { recursive: true });
}

async function checkLogsDir() {
  try {
    await access(LOG_DIR);
  } catch {
    await createLogsDir();
  }
}

function nextFileName(lastFile: string) {
  const regExp = new RegExp(/\d+/g);
  return lastFile.replace(regExp, (match) => (Number(match) + 1).toString());
}

async function checkFileSize(fileName: string, logSize: number = 0) {
  const statFile = await stat(path.join(LOG_DIR, fileName));
  return statFile.size + logSize < LOG_SIZE;
}

export async function saveToLog(log: string, type: 'log' | 'error') {
  let logFile = await getLastLogFileName(type);
  try {
    const isAvailableSize = await checkFileSize(
      logFile,
      Buffer.byteLength(log, 'utf-8'),
    );
    if (!isAvailableSize) logFile = nextFileName(logFile);
    await appendFile(path.join(LOG_DIR, logFile), `${log}\n`);
  } catch {
    await appendFile(path.join(LOG_DIR, logFile), `${log}\n`);
  }
}
