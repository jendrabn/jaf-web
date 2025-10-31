import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

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
let messagingInstance: Messaging | null = null;

export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    try {
      return await getAnalytics(app);
    } catch {
      return null;
    }
  }
  return null;
};

export const getFirebaseMessaging = async () => {
  if (!messagingInstance) {
    const supported = await isSupported();
    messagingInstance = supported ? getMessaging(app) : null;
  }
  return messagingInstance;
};

export const requestFcmToken = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  const permission =
    Notification.permission === "default"
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== "granted") return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const serviceWorkerRegistration =
      "serviceWorker" in navigator
        ? await navigator.serviceWorker.ready
        : undefined;

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration,
    });

    return token || null;
  } catch (error) {
    console.error("[Firebase] Gagal mendapatkan token FCM:", error);
    return null;
  }
};

export const subscribeToForegroundMessages = async (
  callback: (payload: MessagePayload) => void
) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, callback);
};

export default app;
