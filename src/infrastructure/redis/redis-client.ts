import { Redis } from 'ioredis';
import type { RedisOptions } from 'ioredis';
import { createLogger } from '../../fp/infrastructure/Logger.js';

const logger = createLogger('RedisClient');

let redisInstance: Redis | null = null;
let redisSubscriberInstance: Redis | null = null;

const getRedisUrl = () => {
    return process.env.REDIS_URL || 'redis://localhost:6379';
};

/**
 * Returns a shared Redis instance for general commands/publishing.
 */
export const getRedisClient = (): Redis => {
    if (!redisInstance) {
        logger.info('Initializing Redis Client', { url: getRedisUrl() });
        redisInstance = new Redis(getRedisUrl(), {
            maxRetriesPerRequest: null, // Required for BullMQ
        });

        redisInstance.on('error', (err) => {
            logger.error('Redis Client Error', { error: err });
        });

        redisInstance.on('connect', () => {
            logger.info('Redis Client Connected');
        });
    }
    return redisInstance;
};

/**
 * Returns a new Redis instance for subscriptions (blocking).
 * BullMQ requires separate connections for blocking commands.
 */
export const createRedisConnection = (): Redis => {
    const redis = new Redis(getRedisUrl(), {
        maxRetriesPerRequest: null, // Required for BullMQ
    });
    
    redis.on('error', (err) => {
        logger.error('New Redis Connection Error', { error: err });
    });

    return redis;
};
