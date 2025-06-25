import { generateShortCode } from '../utils/shortCodeGenerator.js';
import { findOriginalUrl } from '../models/urlModel.js';
import { saveUrl } from '../models/urlModel.js';

export async function shortenUrl(req, res) {
    const { originalUrl, expiresAt, customAlias } = req.body;

    if (!originalUrl || !originalUrl.startsWith('http')) {
        return res.status(400).json({ error: 'Geçerli bir URL giriniz' });
    }

    const shortCode = customAlias || generateShortCode();

    // Eğer customAlias varsa, çakışma var mı kontrol et
    if (customAlias) {
        const existing = await findOriginalUrl(customAlias);
        if (existing) {
            return res.status(409).json({ error: 'Bu custom alias zaten kullanılıyor' });
        }
    }

    try {
        const saved = await saveUrl({ originalUrl, shortCode, expiresAt });

        const shortUrl = `${process.env.BASE_URL}/${saved.short_code}`;
        res.status(201).json({ shortUrl });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
}

export async function redirectUrl(req, res) {
    const { code } = req.params;

    try {
        const urlRecord = await findOriginalUrl(code);

        if (!urlRecord) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const now = new Date();
        if (urlRecord.expires_at && new Date(urlRecord.expires_at) < now) {
            return res.status(410).json({ error: 'Link süresi dolmuş' });
        }

        return res.redirect(urlRecord.original_url);
    } catch (err) {
        console.error('Redirect error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

