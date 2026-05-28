import path from 'node:path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, errors, json, colorize, printf, splat } = winston.format;

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const consoleDevFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  colorize({ all: true }),
  printf(({ timestamp: ts, level, message, stack }) => `${ts} ${level}: ${stack ?? message}`)
);

const jsonFormat = combine(timestamp(), errors({ stack: true }), splat(), json());

// Pass-through filter that keeps only `security.*` log messages so they can be
// shipped to a SIEM by a tail-based agent without scraping every log line.
const securityOnly = winston.format((info) =>
  typeof info.message === 'string' && info.message.startsWith('security.') ? info : false
);

const logDir = process.env.LOG_DIR || 'logs';

const transports = [
  new winston.transports.Console({
    silent: isTest,
    format: isProd ? jsonFormat : consoleDevFormat,
  }),
];

if (!isTest) {
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      auditFile: path.join(logDir, '.combined-audit.json'),
      format: jsonFormat,
    }),
    // Dedicated stream for `security.*` lines. Retained longer than combined
    // (1y vs 30d) since audit value outlasts operational debugging value.
    new DailyRotateFile({
      dirname: logDir,
      filename: 'security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '365d',
      auditFile: path.join(logDir, '.security-audit.json'),
      format: combine(securityOnly(), jsonFormat),
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  transports,
  exitOnError: false,
});
