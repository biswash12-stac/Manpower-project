/**
 * Security headers configuration (replaces Helmet)
 * ─────────────────────────────────────────────────
 * Applied via Next.js middleware and/or next.config.ts
 */

export const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://images.unsplash.com https://gulf-empire.com blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

/** CORS allowed origins */
export const corsConfig = {
  allowedOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Correlation-Id',
    'X-Idempotency-Key',
  ],
  maxAge: 86400, // 24 hours
};
