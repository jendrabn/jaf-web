import fetchApi, { fetchApi2 } from "@/utils/api";
import type {
  NotificationListResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const fetchNotifications = async (
  page = 1
): Promise<NotificationListResponse> => {
  const response = await fetchApi().get<NotificationListResponse>(
    `/notifications?page=${page}`
  );

  return response as unknown as NotificationListResponse;
};

export const markNotificationAsRead = async (id: number) => {
  return fetchApi().put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return fetchApi().put("/notifications/read-all");
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await fetchApi2("/notifications/unread-count");
  return response as UnreadCountResponse;
};

export const updateFcmToken = async (token: string) => {
  return fetchApi().post("/fcm/token", { fcm_token: token });
};

export const removeFcmToken = async (token?: string) => {
  return fetchApi().delete("/fcm/token", {
    ...(token ? { data: { fcm_token: token } } : {}),
  });
};
