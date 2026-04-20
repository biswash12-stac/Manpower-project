/**
 * Environment configuration — validated at startup with Zod
 * ──────────────────────────────────────────────────────────
 * Import `env` from this file instead of accessing process.env directly.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(15).default(12),

  // Redis (optional)
  REDIS_URL: z.string().optional().default(''),

  // Upload
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  UPLOAD_DIR: z.string().default('public/uploads'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),

  // Seed
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(6).optional(),
  SEED_ADMIN_NAME: z.string().optional(),
});

/** Validated environment — safe to use everywhere */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Environment validation failed. Check your .env file.');
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
