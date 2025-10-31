export const getEnv = (key: string) => {
  if (key.startsWith("VITE_")) key = key.slice(5);

  return import.meta.env[`VITE_${key.toUpperCase()}`] || "";
};

export const env = {
  APP_NAME: getEnv("APP_NAME"),
  APP_URL: getEnv("APP_URL"),
  BASE_API_URL: getEnv("BASE_API_URL"),

  STORE_ADDRESS: getEnv("STORE_ADDRESS"),
  STORE_PHONE: getEnv("STORE_PHONE"),
  STORE_WHATSAPP: getEnv("STORE_WHATSAPP"),
  STORE_EMAIL: getEnv("STORE_EMAIL"),
  STORE_LATITUDE: getEnv("STORE_LATITUDE"),
  STORE_LONGITUDE: getEnv("STORE_LONGITUDE"),
  STORE_OPEN_HOURS: getEnv("STORE_OPEN_HOURS"),

  FACEBOOK_URL: getEnv("FACEBOOK_URL"),
  INSTAGRAM_URL: getEnv("INSTAGRAM_URL"),
  TWITTER_URL: getEnv("TWITTER_URL"),
  TIKTOK_URL: getEnv("TIKTOK_URL"),
  TELEGRAM_URL: getEnv("TELEGRAM_URL"),
  YOUTUBE_URL: getEnv("YOUTUBE_URL"),
  LINKEDIN_URL: getEnv("LINKEDIN_URL"),

  SHOPEE_URL: getEnv("SHOPEE_URL"),
  TOKOPEDIA_URL: getEnv("TOKOPEDIA_URL"),
  LAZADA_URL: getEnv("LAZADA_URL"),
  BUKALAPAK_URL: getEnv("BUKALAPAK_URL"),
  BLIBLI_URL: getEnv("BLIBLI_URL"),

  API_BASE_URL: getEnv("API_BASE_URL"),
  MIDTRANS_ENV: getEnv("MIDTRANS_ENV"),

  FREE_SHIPPING_100K: getEnv("FREE_SHIPPING_100K"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  FIREBASE_VAPID_KEY: getEnv("FIREBASE_VAPID_KEY"),
};
