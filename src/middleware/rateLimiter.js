// src/middleware/rateLimiter.js
import { redisClient } from '../config/redis.js';

export function rateLimiter({ windowSeconds = 60, maxRequests = 5 }) {
    return async (req, res, next) => {
        const ip = req.ip;
        const key = `rl:${ip}`;
        const now = Math.floor(Date.now() / 1000);

        try {
            const current = await redisClient.get(key);

            if (current && parseInt(current) >= maxRequests) {
                return res.status(429).json({
                    error: 'Çok fazla istek. Lütfen sonra tekrar deneyin.',
                });
            }

            if (!current) {
                await redisClient.setEx(key, windowSeconds, "1");
            } else {
                await redisClient.incr(key);
            }

            next();
        } catch (err) {
            console.error('Rate limiter error:', err);
            res.status(500).json({ error: 'Rate limiter sistemi çöktü :(' });
        }
    };
}
