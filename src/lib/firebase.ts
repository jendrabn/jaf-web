import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported as isMessagingSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  type Analytics,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDnJmWPU10PyZInD7g3FdXki2AA8apGl2M",
  authDomain: "jaf-parfums.firebaseapp.com",
  projectId: "jaf-parfums",
  storageBucket: "jaf-parfums.firebasestorage.app",
  messagingSenderId: "572447996666",
  appId: "1:572447996666:web:051391997cf4ebd78fa743",
  measurementId: "G-ZE25G41623",
};

const app = initializeApp(firebaseConfig);

let analyticsInstance: Analytics | null = null;
let messagingPromise: Promise<Messaging | null> | null = null;

export const initAnalytics = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!analyticsInstance && (await isAnalyticsSupported())) {
    analyticsInstance = getAnalytics(app);
  }

  return analyticsInstance;
};

export const getFirebaseMessaging = async () => {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const supported = await isMessagingSupported();
      if (!supported) {
        return null;
      }
      return getMessaging(app);
    })();
  }

  return messagingPromise;
};

export const requestFcmToken = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!("Notification" in window)) {
    console.warn("[Firebase] Browser tidak mendukung Notification API.");
    return null;
  }

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
    if (import.meta.env.DEV) {
      console.info("[Firebase] Status izin notifikasi sesudah request:", permission);
    }
  } else if (import.meta.env.DEV) {
    console.info("[Firebase] Status izin notifikasi saat ini:", permission);
  }

  if (permission !== "granted") {
    console.warn("[Firebase] Izin notifikasi belum diberikan.");
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.warn("[Firebase] Messaging belum tersedia di lingkungan ini.");
    return null;
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as
    | string
    | undefined;

  try {
    let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        serviceWorkerRegistration = await navigator.serviceWorker.ready;
      } catch (error) {
        console.warn("[Firebase] Gagal mendapatkan service worker yang aktif:", error);
      }
    }

    const token = await getToken(messaging, {
      vapidKey: vapidKey && vapidKey.length > 0 ? vapidKey : undefined,
      serviceWorkerRegistration,
    });

    if (token) {
      if (import.meta.env.DEV) {
        console.info("[Firebase] Token FCM berhasil didapatkan:", token);
      }
      return token;
    }

    console.warn("[Firebase] getToken tidak mengembalikan token.");
    return null;
  } catch (error) {
    console.error("[Firebase] Gagal mendapatkan token FCM:", error);
    return null;
  }
};

export const subscribeToForegroundMessages = async (
  callback: (payload: MessagePayload) => void,
): Promise<() => void> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    if (import.meta.env.DEV) {
      console.info("[Firebase] Pesan foreground diterima:", payload);
    }
    callback(payload);
  });
};

export default app;
