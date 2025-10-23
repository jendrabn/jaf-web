# JAF Web — Toko Parfum Online

Aplikasi web e-commerce untuk JAF Parfum's yang memungkinkan pelanggan menjelajah katalog, mengelola keranjang, melakukan checkout, dan melacak pesanan. Dibangun dengan React + Vite (TypeScript) dengan caching PWA untuk performa dan offline support terbatas.

Tech stack ringkas:
- React 18, TypeScript, Vite 6
- React Router v7
- TanStack Query v5 (caching & data fetching)
- Axios untuk HTTP
- Bootstrap 5 + SCSS
- React Hook Form, React-Toastify, React-Select, React-Slick
- PWA via vite-plugin-pwa
- ESLint + TypeScript ESLint

Struktur dan skrip utama:
- Repo: https://github.com/jendrabn/jaf-web
- Skrip npm: dev, build, preview, lint di [package.json](package.json)
- Konfigurasi Vite & PWA: [vite.config.ts](vite.config.ts)
- Contoh variabel lingkungan: [.env.example](.env.example)


## Daftar Halaman

- Home: Beranda dengan banner, highlight produk/layanan, CTA, newsletter, dan tautan marketplace.
- Product: Katalog dengan pencarian serta filter kategori, brand, dan harga.
- Product Detail: Detail produk dengan carousel gambar, ulasan/penilaian, tambah ke keranjang atau wishlist.
- Cart: Daftar item keranjang, ubah kuantitas, hapus item, ringkasan biaya, menuju checkout.
- Checkout:
  - Alamat pengiriman dan kurir/ongkir.
  - Metode pembayaran: manual (transfer) dan otomatis (payment gateway).
  - Kupon dan ringkasan pesanan.
- Blog: Daftar artikel dengan filter dan header.
- Blog Detail: Detail artikel dan fitur berbagi.
- About: Profil singkat perusahaan.
- Contact: Informasi kontak (alamat, telepon, WhatsApp, email).
- FAQ: Pertanyaan yang sering diajukan.
- Help: Pusat bantuan dan panduan cepat.
- Auth: Login, Register, Lupa Password, Reset Password, Verifikasi OTP Login.
- Akun: Profil, Alamat, Pesanan, Detail Pesanan (pelacakan/konfirmasi/beri rating), Wishlist, Ubah Password.
- 404 Not Found.

## Instalasi & Menjalankan di Lokal

Prasyarat:
- Node.js LTS (≥ 18)
- Git

1) Clone repo

```bash
git clone https://github.com/jendrabn/jaf-web.git
cd jaf-web
```

2) Salin environment dan sesuaikan

```bash
cp .env.example .env
# Wajib diisi:
# - VITE_GOOGLE_CLIENT_ID   (sangat penting untuk login Google)
# - VITE_APP_NAME, VITE_APP_URL
# - VITE_BASE_API_URL       (endpoint API backend)
# - Variabel sosial/marketplace sesuai kebutuhan
```

3) Instal dependensi

```bash
npm ci
# atau
npm install
```

4) Jalankan mode pengembangan

```bash
npm run dev
```

Akses: http://localhost:5173

5) Build dan preview produksi (opsional)

```bash
npm run build
npm run preview
```


## Deployment ke Vercel

1) Import proyek dari GitHub (https://github.com/jendrabn/jaf-web) ke Vercel.
2) Framework Preset: Vite.
3) Environment Variables: tambahkan semua variabel VITE_* dari [.env.example](.env.example) ke Project Settings → Environment Variables.
4) Install Command: `npm ci` (atau biarkan default).
5) Build Command: `npm run build`
6) Output Directory: `dist`
7) Deploy.

Catatan:
- Jika memakai custom domain, tambahkan domain di Vercel dan arahkan DNS.
- Pastikan VITE_BASE_API_URL mengizinkan CORS dari domain produksi.


## Deployment ke Ubuntu VPS + Nginx

Prasyarat:
- Domain: jaf.co.id sudah mengarah ke IP server.
- Akses SSH dengan sudo.

1) Update paket dan instal dependensi

```bash
sudo apt-get update
sudo apt-get install -y git nginx
# Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
# Certbot (untuk SSL)
sudo apt-get install -y certbot python3-certbot-nginx
```

2) Clone aplikasi ke /var/www/jaf

```bash
sudo mkdir -p /var/www/jaf
sudo chown -R $USER:$USER /var/www/jaf
git clone https://github.com/jendrabn/jaf-web.git /var/www/jaf
cd /var/www/jaf
```

3) Setup environment

```bash
cp .env.example .env
nano .env
# Penting:
# - VITE_GOOGLE_CLIENT_ID (wajib diisi)
# - VITE_APP_URL (isi dengan https://jaf.co.id)
# - VITE_BASE_API_URL (endpoint API produksi)
```

4) Install dan build

```bash
npm ci
npm run build
```

5) Konfigurasi Nginx (reverse proxy + static)

Buat file konfigurasi domain:

```bash
sudo nano /etc/nginx/sites-available/jaf.co.id
```

Isi dengan:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name jaf.co.id www.jaf.co.id;

  root /var/www/jaf/dist;
  index index.html;

  # React Router history fallback
  location / {
    try_files $uri /index.html;
  }

  # Static assets caching
  location ~* \.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
  }
}
```

Aktifkan site dan cek konfigurasi:

```bash
sudo ln -s /etc/nginx/sites-available/jaf.co.id /etc/nginx/sites-enabled/jaf.co.id
sudo nginx -t
sudo systemctl reload nginx
```

6) Amankan dengan SSL (Certbot)

```bash
sudo certbot --nginx -d jaf.co.id -d www.jaf.co.id --agree-tos -m admin@jaf.co.id --redirect
```

Certbot akan:
- Membuat sertifikat SSL Let’s Encrypt
- Mengupdate blok server untuk listen 443 dan redirect HTTP → HTTPS
- Mengatur auto-renew (systemd timer)

7) Uji dan maintenance

- Buka https://jaf.co.id dan pastikan UI dan asset termuat.
- Untuk update rilis:

```bash
cd /var/www/jaf
git pull
npm ci
npm run build
sudo systemctl reload nginx
```


## Catatan Tambahan

- PWA aktif: build produksi menghasilkan service worker dan manifest dari [vite.config.ts](vite.config.ts).
- Variabel env dibaca via helper [src/utils/config.ts](src/utils/config.ts); pastikan semua VITE_* terdefinisi di .env produksi.
- Jika API berada di domain berbeda, pastikan CORS di server API mengizinkan origin https://jaf.co.id.