type RateLimitRecord = {
  hits: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitRecord>();

export function rateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, {
      hits: 1,
      resetAt: now + windowMs
    });

    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.hits >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.hits += 1;
  buckets.set(key, current);

  return { allowed: true, remaining: maxRequests - current.hits };
}
