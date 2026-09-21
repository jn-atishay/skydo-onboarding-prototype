import Redis, { RedisOptions } from "ioredis";
import { isClientSide } from "../util/functions";

interface RateLimitOptions {
  interval: number; // time interval in seconds
  limit: number; // number of requests allowed in the interval
  blockTime: number; // time in seconds to block user after exceeding limit
}

const RATE_LIMITER_OPTIONS: RateLimitOptions = {
  interval: 5,
  limit: 100,
  blockTime: 600,
};

const option: RedisOptions = {
  host: process.env.REDIS_HOST!,
  password: process.env.REDIS_PASSWORD!,
  port: parseInt(process.env.REDIS_PORT!, 10),
};

const redisClient = (() => {
  if (isClientSide()) return null;
  return new Redis(option);
})();

async function doRateLimiting(key: string) {
  if (process.env.NODE_ENV === "development" || isClientSide() || !redisClient) {
    return true;
  }
  const limit: number = RATE_LIMITER_OPTIONS.limit;
  const intervalTime: number = RATE_LIMITER_OPTIONS.interval;
  const blockingTime: number = RATE_LIMITER_OPTIONS.blockTime;

  const rateLimitKey = `rate_limit:${key}`;
  const blockKey = `block:${key}`;

  const isBlocked = await redisClient.get(blockKey);
  if (isBlocked) {
    return false;
  }

  const count = await redisClient.incr(rateLimitKey);
  const ttl = await redisClient.ttl(rateLimitKey);

  if (count > limit) {
    redisClient.set(blockKey, "true", "EX", blockingTime);
    fetch("https://hooks.zapier.com/hooks/catch/13320504/3ufmklm/", {
      method: "POST",
      body: JSON.stringify({
        ip: key,
        count: count,
        time: Date.now(),
        rateLimitOptions: RATE_LIMITER_OPTIONS,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    return false;
  }

  if (ttl === -1) {
    redisClient.expire(rateLimitKey, intervalTime);
  }
  return true;
}

export default doRateLimiting;
