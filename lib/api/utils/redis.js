import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisPassword = process.env.REDIS_PASSWORD;

const redisOptions = {
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

if (redisPassword) {
  redisOptions.password = redisPassword;
}

// Create a shared connection for general use
const redis = new Redis(redisUrl, redisOptions);

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});

// Helper to create new connections for BullMQ workers/queues
export const createRedisConnection = () => {
  return new Redis(redisUrl, redisOptions);
};

export default redis;
