import app from './src/app.js';
import dotenv from 'dotenv';
import { redisClient } from './src/config/redis.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await redisClient.connect();
        console.log('✅ Redis bağlantısı başarılı');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Redis bağlantı hatası:', err);
    }
}

start();
