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

const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;

const broadcastToClients = async (message) => {
  const clientList = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clientList) {
    client.postMessage(message);
  }

  if (clientList.length === 0) {
    console.info("[Firebase][SW] Tidak ada window client untuk menerima broadcast:", message.type);
  }
};

const displayNotification = async (payload) => {
  console.info("[Firebase][SW] Pesan background diterima:", payload);
  const notification = payload.notification ?? {};

  const fallbackTag = `fcm-${Date.now()}`;
  const title = notification.title || "JAF Parfum's";
  const tag =
    notification.tag ||
    payload.collapseKey ||
    payload.collapse_key ||
    payload.messageId ||
    fallbackTag;

  const notificationOptions = {
    body: notification.body,
    icon: notification.icon || "/images/favicon-96x96.png",
    data: {
      ...payload.data,
      _fcmMessageId: payload.messageId,
      _receivedAt: Date.now(),
    },
    tag,
    badge: notification.badge || "/images/favicon-96x96.png",
  };

  if (notification.image) {
    notificationOptions.image = notification.image;
  }

  if (tag !== fallbackTag) {
    notificationOptions.renotify = true;
  }

  try {
    await self.registration.showNotification(title, notificationOptions);
    const activeNotifications = await self.registration.getNotifications({
      includeTriggered: true,
    });
    console.info("[Firebase][SW] Notifikasi OS dipicu:", {
      title,
      tag: notificationOptions.tag,
      activeNotificationCount: activeNotifications.length,
      activeNotificationTitles: activeNotifications.map((item) => item.title),
    });
    await broadcastToClients({
      type: "FCM_NOTIFICATION_SHOWN",
      title,
      tag: notificationOptions.tag ?? null,
      payload,
    });
  } catch (error) {
    console.error("[Firebase][SW] Gagal menampilkan notifikasi:", error);
    await broadcastToClients({
      type: "FCM_NOTIFICATION_ERROR",
      error: error instanceof Error ? error.message : String(error),
      payload,
    });
  }
};

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    void displayNotification(payload);
  });
} else {
  console.warn("[Firebase][SW] Messaging tidak didukung di lingkungan ini.");
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.click_action ||
    event.notification?.data?.link ||
    "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client && targetUrl) {
              client.navigate(targetUrl);
            }
            return;
          }
        }
        if (self.clients.openWindow && targetUrl) {
          return self.clients.openWindow(targetUrl);
        }
        return undefined;
      }),
  );
});
