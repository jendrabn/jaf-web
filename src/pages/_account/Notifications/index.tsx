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
import { updateFcmToken as updateFcmTokenRequest } from "@/hooks/api/notification";

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
  const [isRequestingPush, setIsRequestingPush] = useState(false);
  const [isSyncingToken, setIsSyncingToken] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);

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

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    if (notifications.length > 0) {
      markAllAsReadMutation.mutate();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const syncTokenWithServer = useCallback(
    async (
      token: string | null,
      options: { silent?: boolean } = {}
    ): Promise<void> => {
      const { silent = false } = options;

      const reportSuccess = (message: string | null) => {
        if (!silent) {
          setPushSuccess(message);
          if (message) {
            setPushError(null);
          }
        }
      };

      const reportError = (message: string) => {
        if (!silent) {
          setPushError(message);
        }
      };

      try {
        if (token) {
          if (token === syncedToken) {
            reportSuccess("Push notification berhasil diaktifkan.");
            return;
          }
          setIsSyncingToken(true);
          await updateFcmTokenRequest(token);
          setSyncedToken(token);
          reportSuccess("Push notification berhasil diaktifkan.");
        } else if (syncedToken) {
          setIsSyncingToken(true);
          await updateFcmTokenRequest(null);
          setSyncedToken(null);
          reportSuccess(null);
        }
      } catch (error) {
        console.error("Failed to sync FCM token with server", error);
        reportError(
          token
            ? "Gagal mendaftarkan token notifikasi ke server."
            : "Gagal menghapus token notifikasi di server."
        );
      } finally {
        setIsSyncingToken(false);
      }
    },
    [syncedToken]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("Notification" in window)) {
      setPushPermission("unsupported");
      return;
    }

    let isMounted = true;

    const initializeToken = async () => {
      const permission = Notification.permission;
      if (!isMounted) {
        return;
      }

      setPushPermission(permission);

      if (permission === "granted") {
        try {
          const token = await requestFcmToken();
          if (!isMounted) {
            return;
          }
          await syncTokenWithServer(token ?? null, { silent: true });
        } catch (error) {
          console.error("Gagal mengambil token FCM awal", error);
        }
      } else {
        await syncTokenWithServer(null, { silent: true });
      }
    };

    void initializeToken();

    return () => {
      isMounted = false;
    };
  }, [syncTokenWithServer]);

  const handleEnablePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushError("Browser Anda belum mendukung push notification.");
      return;
    }

    setIsRequestingPush(true);
    setPushError(null);
    setPushSuccess(null);

    try {
      const token = await requestFcmToken();
      const permission = Notification.permission;
      setPushPermission(permission);

      if (permission !== "granted") {
        await syncTokenWithServer(null);
        setPushError("Izin notifikasi belum diberikan.");
        return;
      }

      if (token) {
        await syncTokenWithServer(token);
      } else {
        await syncTokenWithServer(null);
        setPushError(
          "Token perangkat tidak dapat diperoleh. Silakan coba lagi."
        );
      }
    } catch (err) {
      setPushError("Terjadi kesalahan saat mengaktifkan push notification.");
      console.error(err);
    } finally {
      setIsRequestingPush(false);
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
          Terjadi kesalahan saat memuat notifikasi. Silakan coba lagi.
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
          <Alert variant="warning" className="mb-0">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Browser Anda belum mendukung push notification.
          </Alert>
        ) : (
          <Alert variant="light" className="border mb-0">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <div className="fw-semibold mb-1">Notifikasi Browser</div>
                <div className="text-muted small">
                  {pushPermission === "granted"
                    ? "Notifikasi browser aktif. Anda akan menerima pembaruan secara otomatis."
                    : "Aktifkan notifikasi untuk menerima pemberitahuan pesanan dan promo secara real-time."}
                </div>
                {pushSuccess && (
                  <div className="text-success small mt-2">
                    <i className="bi bi-check-circle me-1"></i>
                    {pushSuccess}
                  </div>
                )}
                {pushError && (
                  <div className="text-danger small mt-2">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {pushError}
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
                    disabled={isRequestingPush || isSyncingToken}
                  >
                    {isRequestingPush || isSyncingToken ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
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
        <div>
          {/* {unreadCount > 0 && (
            <Badge bg="primary" pill>
              {unreadCount} belum dibaca
            </Badge>
          )} */}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
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
