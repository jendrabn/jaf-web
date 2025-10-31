importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDnJmWPU10PyZInD7g3FdXki2AA8apGl2M",
  authDomain: "jaf-parfums.firebaseapp.com",
  projectId: "jaf-parfums",
  storageBucket: "jaf-parfums.firebasestorage.app",
  messagingSenderId: "572447996666",
  appId: "1:572447996666:web:051391997cf4ebd78fa743",
  measurementId: "G-ZE25G41623",
};

firebase.initializeApp(firebaseConfig);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;

const showNotification = (payload) => {
  const notification = payload.notification || {};
  const title = notification.title || "JAF Parfum's";
  const tag = notification.tag || payload.messageId || `fcm-${Date.now()}`;

  const options = {
    body: notification.body,
    icon: notification.icon || "/images/favicon-96x96.png",
    badge: "/images/favicon-96x96.png",
    tag,
    data: {
      ...payload.data,
      _fcmMessageId: payload.messageId,
    },
    renotify: tag !== `fcm-${Date.now()}`,
  };

  if (notification.image) options.image = notification.image;

  self.registration.showNotification(title, options);
};

if (messaging) {
  messaging.onBackgroundMessage(showNotification);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.click_action || event.notification?.data?.link || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.focus) {
            client.focus();
            if (client.navigate && url !== "/") client.navigate(url);
            return;
          }
        }
        return clients.openWindow(url);
      })
  );
});
