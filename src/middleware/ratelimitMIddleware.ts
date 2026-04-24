import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for development)
// In production, use Redis or Upstash
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export function rateLimit(config: RateLimitConfig) {
  return async function(req: NextRequest): Promise<NextResponse | null> {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'anonymous';
    
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    
    // Clean up expired records
    if (record && record.resetTime < now) {
      rateLimitStore.delete(ip);
    }
    
    const currentRecord = rateLimitStore.get(ip);
    
    if (!currentRecord) {
      // First request from this IP
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Continue
    }
    
    // Increment count
    if (currentRecord.count < config.maxRequests) {
      currentRecord.count++;
      rateLimitStore.set(ip, currentRecord);
      return null; // Continue
    }
    
    // Rate limit exceeded
    const retryAfter = Math.ceil((currentRecord.resetTime - now) / 1000);
    
    return NextResponse.json(
      {
        success: false,
        message: config.message || `Too many requests. Please try again in ${retryAfter} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': currentRecord.resetTime.toString(),
        },
      }
    );
  };
}

// Pre-configured limiters
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests
  message: 'Too many attempts. Please try again after 15 minutes.',
});

export const standardRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  message: 'Too many requests. Please slow down.',
});

export const relaxedRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});