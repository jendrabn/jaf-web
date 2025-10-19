export const getEnv = (key: string) => {
  if (key.startsWith("VITE_")) key = key.slice(5);

  return import.meta.env[`VITE_${key.toUpperCase()}`] || "";
};

export const env = {
  APP_NAME: getEnv("APP_NAME") || "JAF Parfum's",
  APP_URL: getEnv("APP_URL") || "https://jaf.co.id",
  BASE_API_URL: getEnv("BASE_API_URL") || "http://jaf.test/api",

  STORE_ADDRESS:
    getEnv("STORE_ADDRESS") ||
    "Jl. Letjen Panjaitan No. 147, Gumuk Kerang, Kel. Sumbersari, Kec. Sumbersari, Kab. Jember, Jawa Timur 68121",
  STORE_PHONE: getEnv("STORE_PHONE") || "0331 322070",
  STORE_WHATSAPP: getEnv("STORE_WHATSAPP") || "628113132502",
  STORE_EMAIL: getEnv("STORE_EMAIL") || "cs@jaf.co.id",
  STORE_LATITUDE: getEnv("STORE_LATITUDE"),
  STORE_LONGITUDE: getEnv("STORE_LONGITUDE"),
  STORE_OPEN_HOURS:
    getEnv("STORE_OPEN_HOURS") || "Senin - Jumat: 08:00 - 17:00",

  FACEBOOK_URL: getEnv("FACEBOOK_URL") || "https://www.facebook.com/jafparfums",
  INSTAGRAM_URL:
    getEnv("INSTAGRAM_URL") || "https://www.instagram.com/jafparfums",
  TWITTER_URL: getEnv("TWITTER_URL") || "https://twitter.com/jafparfums",
  TIKTOK_URL: getEnv("TIKTOK_URL") || "https://www.tiktok.com/@jafparfums",
  TELEGRAM_URL: getEnv("TELEGRAM_URL") || "https://t.me/jafparfums",
  YOUTUBE_URL: getEnv("YOUTUBE_URL") || "https://www.youtube.com/c/jafparfums",
  LINKEDIN_URL:
    getEnv("LINKEDIN_URL") || "https://www.linkedin.com/company/jafparfums",

  SHOPEE_URL: getEnv("SHOPEE_URL"),
  TOKOPEDIA_URL: getEnv("TOKOPEDIA_URL"),
  LAZADA_URL: getEnv("LAZADA_URL"),
  BUKALAPAK_URL: getEnv("BUKALAPAK_URL"),
  BLIBLI_URL: getEnv("BLIBLI_URL"),

  API_BASE_URL:
    getEnv("API_BASE_URL") || getEnv("BASE_API_URL") || "http://jaf.test/api",
  MIDTRANS_ENV: getEnv("MIDTRANS_ENV") || "sandbox",

  FREE_SHIPPING_100K: getEnv("FREE_SHIPPING_100K") || false,

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID") || "",
};
