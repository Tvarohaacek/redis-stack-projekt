import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('❌ Redis: Too many reconnection attempts');
                return new Error('Too many retries');
            }
            const delay = Math.min(retries * 100, 3000);
            console.log(`⏳ Redis: Reconnecting in ${delay}ms...`);
            return delay;
        },
    },
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Redis: Connected');
});

redisClient.on('ready', () => {
    console.log('✅ Redis: Ready');
});

redisClient.on('reconnecting', () => {
    console.log('🔄 Redis: Reconnecting...');
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('✅ Redis connection established');
    } catch (error) {
        console.error('❌ Failed to connect to Redis:', error);
        throw error;
    }
}

export async function disconnectRedis() {
    try {
        await redisClient.quit();
        console.log('👋 Redis disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting Redis:', error);
    }
}