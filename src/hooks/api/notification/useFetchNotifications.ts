import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "./index";
import { toast } from "react-toastify";
import type { NotificationListResponse } from "@/types/notification";

export const useFetchNotifications = (page = 1) => {
  return useQuery<NotificationListResponse>({
    queryKey: ["notifications", page],
    queryFn: () => fetchNotifications(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast("Notifikasi ditandai sebagai dibaca");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menandai notifikasi sebagai dibaca";
      toast(errorMessage);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast("Semua notifikasi ditandai sebagai dibaca");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menandai semua notifikasi sebagai dibaca";
      toast(errorMessage);
    },
  });
};

export const useGetUnreadCount = () => {
  return useQuery<number>({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const response = await getUnreadCount();
      if (typeof response === "number") {
        return response;
      }
      if (response && typeof response === "object") {
        if ("data" in response && typeof response.data === "number") {
          return response.data;
        }
        if ("count" in response && typeof response.count === "number") {
          return response.count;
        }
      }

      return 0;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
