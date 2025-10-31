export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  category: string;
  level: "info" | "success" | "warning" | "error";
  url?: string;
  icon?: string;
  meta?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface NotificationListResponse {
  data: Notification[];
  page: NotificationPagination;
}

export interface UnreadCountResponse {
  data?: number;
  count?: number;
}
