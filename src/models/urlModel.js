import { db } from '../config/database.js';

// 1. Yeni URL kaydet
export async function saveUrl({ originalUrl, shortCode, expiresAt = null }) {
    const query = `
        INSERT INTO urls (original_url, short_code, expires_at)
        VALUES ($1, $2, $3)
            RETURNING *;
    `;
    const values = [originalUrl, shortCode, expiresAt];
    const result = await db.query(query, values);
    return result.rows[0];
}


// 2. Short code ile orijinal URL'yi bul
export async function findOriginalUrl(shortCode) {
    const query = `SELECT * FROM urls WHERE short_code = $1`;
    const result = await db.query(query, [shortCode]);
    return result.rows[0]; // short_code unique olduğundan tek satır beklenir
}
