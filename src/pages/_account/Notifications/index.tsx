import { useCallback, useEffect, useState } from "react";
import AccountLayout from "@/components/layouts/AccountLayout";
import NotificationItem from "@/components/parts/NotificationItem";
import {
  useFetchNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/api/notification/useFetchNotifications";
import { Button, Badge, Spinner, Alert, Pagination } from "react-bootstrap";
import Loading from "@/components/ui/Loading";
import { requestFcmToken } from "@/lib/firebase";
import { updateFcmToken } from "@/hooks/api/notification";

const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pushPermission, setPushPermission] = useState<
    NotificationPermission | "unsupported"
  >(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const [syncedToken, setSyncedToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string | null;
  }>({ type: "success", text: null });

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useFetchNotifications(currentPage);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const notifications = notificationsData?.data ?? [];
  const pagination = notificationsData?.page;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = (id: number) => markAsReadMutation.mutate(id);
  const handleMarkAllAsRead = () =>
    notifications.length > 0 && markAllAsReadMutation.mutate();
  const handlePageChange = (page: number) => setCurrentPage(page);

  const syncToken = useCallback(
    async (token: string | null, silent = false) => {
      try {
        if (token && token !== syncedToken) {
          setIsProcessing(true);
          await updateFcmToken(token);
          setSyncedToken(token);
          if (!silent)
            setMessage({
              type: "success",
              text: "Push notification berhasil diaktifkan.",
            });
        } else if (!token && syncedToken) {
          setIsProcessing(true);
          await updateFcmToken(null);
          setSyncedToken(null);
        }
      } catch {
        if (!silent)
          setMessage({
            type: "error",
            text: token
              ? "Gagal mendaftarkan token notifikasi."
              : "Gagal menghapus token notifikasi.",
          });
      } finally {
        setIsProcessing(false);
      }
    },
    [syncedToken]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushPermission("unsupported");
      return;
    }

    const init = async () => {
      const permission = Notification.permission;
      setPushPermission(permission);

      if (permission === "granted") {
        const token = await requestFcmToken();
        await syncToken(token ?? null, true);
      } else {
        await syncToken(null, true);
      }
    };

    init();
  }, [syncToken]);

  const handleEnablePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setMessage({
        type: "error",
        text: "Browser tidak mendukung push notification.",
      });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: "success", text: null });

    try {
      const token = await requestFcmToken();
      const permission = Notification.permission;
      setPushPermission(permission);

      if (permission !== "granted") {
        await syncToken(null);
        setMessage({ type: "error", text: "Izin notifikasi belum diberikan." });
      } else if (token) {
        await syncToken(token);
      } else {
        await syncToken(null);
        setMessage({
          type: "error",
          text: "Token tidak dapat diperoleh. Silakan coba lagi.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan saat mengaktifkan push notification.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <AccountLayout title="Notifikasi">
        <Loading className="py-5" />
      </AccountLayout>
    );
  }

  if (error) {
    return (
      <AccountLayout title="Notifikasi">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Terjadi kesalahan saat memuat notifikasi.
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={() => refetch()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
        </Alert>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Notifikasi">
      <div className="mb-4">
        {pushPermission === "unsupported" ? (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Browser tidak mendukung push notification.
          </Alert>
        ) : (
          <Alert variant="light" className="border">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <div className="fw-semibold mb-1">Notifikasi Browser</div>
                <div className="text-muted small">
                  {pushPermission === "granted"
                    ? "Notifikasi browser aktif. Anda akan menerima pembaruan secara otomatis."
                    : "Aktifkan notifikasi untuk menerima pemberitahuan pesanan dan promo secara real-time."}
                </div>
                {message.text && (
                  <div className={`text-${message.type} small mt-2`}>
                    <i
                      className={`bi bi-${
                        message.type === "success" ? "check" : "exclamation"
                      }-circle me-1`}
                    ></i>
                    {message.text}
                  </div>
                )}
              </div>
              <div>
                {pushPermission === "granted" ? (
                  <Badge bg="success" pill>
                    Notifikasi aktif
                  </Badge>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleEnablePush}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" />
                        <span className="ms-2">Memproses...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-bell me-1"></i>
                        Izinkan Notifikasi
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div></div>
        {unreadCount > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                <span className="ms-2">Memproses...</span>
              </>
            ) : (
              <>
                <i className="bi bi-check-all me-1"></i>
                Tandai semua dibaca
              </>
            )}
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
          {pagination && pagination.last_page > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {Array.from(
                  { length: pagination.last_page },
                  (_, i) => i + 1
                ).map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === pagination.last_page}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i
              className="bi bi-bell text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
          </div>
          <h5 className="text-muted">Belum ada notifikasi</h5>
          <p className="text-muted">Anda belum memiliki notifikasi saat ini.</p>
        </div>
      )}
    </AccountLayout>
  );
};

export default NotificationsPage;
