/**
 * Winston logger configuration
 * ─────────────────────────────
 */

import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/** Custom log format */
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});

/** Logger instance */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  defaultMeta: { service: 'gulf-empire-api' },
  transports: [
    // Console — always enabled
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

// File transports in production only
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  );
}
