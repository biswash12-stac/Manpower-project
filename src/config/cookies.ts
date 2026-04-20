/**
 * Cookie configuration for auth tokens
 * ─────────────────────────────────────
 */

import { env } from './env';
import { COOKIE_NAMES } from '@/src/utils/constants';

export interface CookieConfig {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number; // seconds
}

const isProduction = env.NODE_ENV === 'production';

/** Access token cookie — short-lived (15 min default) */
export const accessTokenCookie: CookieConfig = {
  name: COOKIE_NAMES.ACCESS_TOKEN,
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 60, // 15 minutes
};

/** Refresh token cookie — long-lived (7 days default) */
export const refreshTokenCookie: CookieConfig = {
  name: COOKIE_NAMES.REFRESH_TOKEN,
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

/** Build a Set-Cookie header value */
export function buildCookieHeader(config: CookieConfig, value: string): string {
  const parts = [
    `${config.name}=${value}`,
    `Path=${config.path}`,
    `Max-Age=${config.maxAge}`,
    `SameSite=${config.sameSite.charAt(0).toUpperCase() + config.sameSite.slice(1)}`,
  ];

  if (config.httpOnly) parts.push('HttpOnly');
  if (config.secure) parts.push('Secure');

  return parts.join('; ');
}

/** Build a cookie-clearing header */
export function buildClearCookieHeader(config: CookieConfig): string {
  return buildCookieHeader({ ...config, maxAge: 0 }, '');
}
