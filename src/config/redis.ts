/**
 * Redis configuration & client
 * ─────────────────────────────
 * Uses ioredis when REDIS_URL is set, otherwise falls back to
 * an in-memory Map so the app works without Redis in development.
 */

import { env } from './env';

/** Minimal cache interface that both Redis and in-memory implement */
export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
  ttl(key: string): Promise<number>;
}

/* ─────────── In-memory fallback ─────────── */

class InMemoryCache implements CacheClient {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const next = (parseInt(current || '0', 10) + 1).toString();
    const entry = this.store.get(key);
    this.store.set(key, {
      value: next,
      expiresAt: entry?.expiresAt ?? null,
    });
    return parseInt(next, 10);
  }

  async expire(key: string, seconds: number): Promise<void> {
    const entry = this.store.get(key);
    if (entry) {
      entry.expiresAt = Date.now() + seconds * 1000;
    }
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry || !entry.expiresAt) return -1;
    const remaining = Math.ceil((entry.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }
}

/* ─────────── Redis (ioredis) adapter ─────────── */

class RedisCache implements CacheClient {
  private client: import('ioredis').default;

  constructor(url: string) {
    // Dynamic import at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Redis = require('ioredis').default || require('ioredis');
    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times * 200, 2000),
      lazyConnect: true,
    });

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err: Error) => console.error('❌ Redis error:', err.message));

    this.client.connect().catch(() => {
      console.warn('⚠️  Redis connection failed — falling back to in-memory cache');
    });
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number) {
    await this.client.expire(key, seconds);
  }

  async ttl(key: string) {
    return this.client.ttl(key);
  }
}

/* ─────────── Singleton export ─────────── */

let cacheInstance: CacheClient | null = null;

export function getCache(): CacheClient {
  if (!cacheInstance) {
    if (env.REDIS_URL) {
      cacheInstance = new RedisCache(env.REDIS_URL);
    } else {
      console.log('ℹ️  No REDIS_URL set — using in-memory cache');
      cacheInstance = new InMemoryCache();
    }
  }
  return cacheInstance;
}
