# JAF Parfum's — Frontend E‑Commerce

Aplikasi web e‑commerce untuk JAF Parfum's. Tujuan utama aplikasi ini adalah menampilkan katalog parfum, detail produk, keranjang, checkout, manajemen pesanan, wishlist, blog, FAQ, serta halaman informasi toko. Aplikasi berjalan cepat karena menggunakan arsitektur SPA (Single Page Application).

Nama aplikasi dan konfigurasi dapat disesuaikan melalui variabel lingkungan (ENV).

## Fitur Utama

- Katalog produk dengan pencarian dan filter.
- Detail produk dengan galeri gambar.
- Keranjang belanja dan pengaturan kuantitas.
- Wishlist untuk menyimpan produk favorit.
- Checkout multi‑tahap (alamat pengiriman, metode pembayaran, ringkasan pesanan, kupon).
- Manajemen pesanan: daftar/riwayat, detail pesanan, konfirmasi penerimaan dan pembayaran, penilaian/rating.
- Autentikasi: login, registrasi, verifikasi OTP, lupa/reset password, dan login via Google OAuth.
- Blog (artikel, kategori/tag) dan halaman informasi (About, Contact, Help, FAQ).
- Notifikasi instan untuk sukses/gagal aksi.
- Dukungan tema gelap/terang.

## Halaman (sekilas)

Total sekitar 23 halaman, meliputi:

- Beranda
- Katalog Produk
- Detail Produk
- Blog & Detail Blog
- Kontak, Tentang, Bantuan, FAQ
- Keranjang, Checkout
- Akun: Profil, Pesanan, Detail Pesanan, Wishlist, Alamat, Ubah Password
- Autentikasi: Login, Verifikasi Login, Registrasi, Reset Password, Lupa Password
- Not Found

## Persyaratan

- Node.js 18 atau lebih baru
- NPM (atau Yarn/PNPM sesuai preferensi)

## Menjalankan Secara Lokal

1) Instal dependensi: jalankan perintah instal paket (contoh: npm install).
2) Siapkan file ENV (lihat bagian “Konfigurasi Lingkungan”).
3) Jalankan pengembangan: jalankan perintah dev server (contoh: npm run dev).
4) Build produksi: jalankan perintah build (contoh: npm run build).
5) Preview build: jalankan perintah preview (contoh: npm run preview).

## Konfigurasi Lingkungan (ENV)

Buat file ENV (misalnya .env atau .env.local) dan isi sesuai kebutuhan. Berikut kelompok variabel yang tersedia:

- App:
  - VITE_APP_NAME: Nama aplikasi (mis. “JAF Parfum's”).
  - VITE_APP_URL: URL aplikasi (mis. <https://contoh.com>).
- API:
  - VITE_BASE_API_URL: URL dasar API backend (mis. <https://api.contoh.com>).
- Informasi Toko:
  - VITE_STORE_ADDRESS, VITE_STORE_PHONE, VITE_STORE_WHATSAPP, VITE_STORE_EMAIL
  - VITE_STORE_LATITUDE, VITE_STORE_LONGITUDE, VITE_STORE_OPEN_HOURS
- Sosial Media:
  - VITE_FACEBOOK_URL, VITE_INSTAGRAM_URL, VITE_TWITTER_URL, VITE_TIKTOK_URL
  - VITE_TELEGRAM_URL, VITE_YOUTUBE_URL, VITE_LINKEDIN_URL
- E‑commerce Marketplace:
  - VITE_SHOPEE_URL, VITE_TOKOPEDIA_URL, VITE_LAZADA_URL, VITE_BUKALAPAK_URL, VITE_BLIBLI_URL
- Fitur:
  - VITE_FREE_SHIPPING_100K: aktifkan pengiriman gratis (true/false).
- Google OAuth:
  - GOOGLE_CLIENT_ID: Client ID dari Google Cloud Console untuk login Google.

## Deployment

Anda dapat melakukan deployment ke berbagai platform. Gunakan langkah umum berikut:

### Opsi 1 — Vercel

- Import repository ke Vercel.
- Set environment variables (lihat bagian “Konfigurasi Lingkungan (ENV)”).
- Build Command: npm run build
- Output/Publish Directory: dist
- Jalankan deploy; Vercel akan menyajikan aplikasi SPA secara otomatis.

### Opsi 2 — Netlify

- Hubungkan repository ke Netlify.
- Set environment variables.
- Build Command: npm run build
- Publish Directory: dist
- Deploy dan aktifkan pengaturan redirect SPA default jika diperlukan.

### Opsi 3 — Hosting Static (Nginx/Apache/Cloud Storage)

- Lakukan build produksi secara lokal atau melalui CI (npm run build).
- Upload seluruh isi folder “dist” ke server/hosting static.
- Untuk SPA, pastikan konfigurasi redirect (fallback ke index.html) telah disetel agar routing sisi klien berfungsi.

### Opsi 4 — Container/CI (opsional)

- Jalankan pipeline CI Anda untuk build.
- Publikasikan artefak build (folder dist) ke target hosting.

## Deployment di VPS Ubuntu Server + Nginx

Langkah umum untuk menyajikan hasil build (folder dist) sebagai situs statis dengan dukungan SPA:

1) Persiapan server

- Update paket, pasang Nginx, dan buka firewall HTTP/HTTPS.

```
sudo apt update
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'
```

2) Upload artefak build

- Lakukan build di mesin lokal atau di server (npm run build).
- Salin isi folder dist ke direktori web, misalnya /var/www/jaf/dist.
- Atur kepemilikan agar Nginx dapat mengakses.

```
sudo mkdir -p /var/www/jaf
sudo cp -r dist /var/www/jaf/
sudo chown -R www-data:www-data /var/www/jaf
```

3) Konfigurasi Nginx (server block)

- Buat server block untuk domain Anda dan arahkan root ke folder dist.
- Pastikan SPA fallback aktif melalui try_files ke /index.html.

```
server {
  listen 80;
  server_name contoh.com www.contoh.com;

  root /var/www/jaf/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|webp|woff2?)$ {
    expires 7d;
    access_log off;
    add_header Cache-Control "public, max-age=604800, immutable";
    try_files $uri =404;
  }

  location ~* \.(?:json|txt|xml|webmanifest)$ {
    expires 1h;
    access_log off;
    add_header Cache-Control "public, max-age=3600";
    try_files $uri =404;
  }

  # Opsional: tingkatkan keamanan header dasar
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

Aktifkan konfigurasi dan muat ulang Nginx:

```
# Simpan sebagai /etc/nginx/sites-available/jaf.conf
# Lalu aktifkan:
sudo ln -s /etc/nginx/sites-available/jaf.conf /etc/nginx/sites-enabled/jaf.conf
sudo nginx -t
sudo systemctl reload nginx
```

4) HTTPS (opsional, disarankan)

- Pasang Certbot dan minta sertifikat SSL.

```
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d contoh.com -d www.contoh.com
```