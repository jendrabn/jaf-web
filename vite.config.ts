// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      // ⚠️ Jangan aktifkan dev SW kecuali sedang debug
      // devOptions: { enabled: false },

      includeAssets: ["images/**"],
      manifest: {
        name: "JAF Parfum's",
        short_name: "JAF",
        description:
          "Belanja parfum original dengan pilihan aroma eksklusif dan layanan pengiriman cepat.",
        theme_color: "#dbb635",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        lang: "id-ID",
        icons: [
          {
            src: "/images/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/images/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        // Precache file build + aset umum
        globPatterns: ["**/*.{js,css,html,svg,png,ico,jpg,jpeg,webp,woff2}"],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,

        navigateFallback: "/index.html",

        runtimeCaching: [
          // Aset JS/CSS/worker – cepat update
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "assets" },
          },

          // Gambar lokal
          {
            urlPattern:
              /\/images\/.*\.(?:png|jpg|jpeg|svg|webp|ico|avif|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
              },
            },
          },

          // Google Fonts CSS
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },

          // Google Fonts files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              },
            },
          },

          // Bootstrap Icons CSS via jsDelivr
          {
            urlPattern:
              /^https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap-icons@.*\/font\/.*\.css$/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "bootstrap-icons-css" },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { "@": "/src" },
  },
});
