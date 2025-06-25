import { generateShortCode } from '../utils/shortCodeGenerator.js';

export async function shortenUrl(req, res) {
    const { originalUrl } = req.body;

    // Basic URL validation
    if (!originalUrl || !originalUrl.startsWith('http')) {
        return res.status(400).json({ error: 'Geçerli bir URL giriniz' });
    }

    const shortCode = generateShortCode();
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    // DB'ye kaydedilecek (şimdilik simüle ediyoruz)
    console.log(`Saved: ${originalUrl} -> ${shortUrl}`);

    res.status(201).json({ shortUrl });
}

export async function redirectUrl(req, res) {
    const { code } = req.params;

    // DB'den sorgulama simülasyonu
    const fakeUrl = 'https://google.com'; // Bu normalde veritabanından gelir

    if (!fakeUrl) {
        return res.status(404).json({ error: 'Link bulunamadı' });
    }

    res.redirect(fakeUrl);
}
