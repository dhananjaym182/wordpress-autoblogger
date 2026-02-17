import { redis } from './redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit: number,
  window: number // in seconds
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window * 1000;

  const pipeline = redis.pipeline();

  // Remove old entries
  pipeline.zremrangebyscore(key, 0, windowStart);

  // Count current entries
  pipeline.zcard(key);

  // Add current request
  pipeline.zadd(key, now, `${now}-${Math.random()}`);

  // Set expiration
  pipeline.expire(key, window);

  const results = await pipeline.exec();

  if (!results) {
    throw new Error('Redis pipeline failed');
  }

  const count = results[1][1] as number;
  const success = count <= limit;

  return {
    success,
    limit,
    remaining: Math.max(0, limit - count),
    reset: now + window * 1000,
  };
}

export const rateLimits = {
  // Authentication
  login: (identifier: string) => rateLimit(identifier, 5, 15 * 60), // 5 attempts per 15 min
  signup: (identifier: string) => rateLimit(identifier, 3, 60 * 60), // 3 signups per hour
  passwordReset: (identifier: string) => rateLimit(identifier, 3, 60 * 60), // 3 resets per hour

  // WordPress
  wpConnect: (identifier: string) => rateLimit(identifier, 10, 60 * 60), // 10 connections per hour

  // AI Generation (per organization)
  aiGenerate: (identifier: string) => rateLimit(identifier, 20, 60), // 20 requests per minute

  // Publishing (per organization)
  publishPost: (identifier: string) => rateLimit(identifier, 10, 60), // 10 publishes per minute

  // API endpoints (per org)
  apiGeneral: (identifier: string) => rateLimit(identifier, 100, 60), // 100 requests per minute

  // Image generation (expensive)
  imageGenerate: (identifier: string) => rateLimit(identifier, 5, 60), // 5 images per minute

  // Content scheduling
  schedulePost: (identifier: string) => rateLimit(identifier, 30, 60), // 30 schedules per minute
};
