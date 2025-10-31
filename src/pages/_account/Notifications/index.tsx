import { useState } from "react";
import AccountLayout from "@/components/layouts/AccountLayout";
import NotificationItem from "@/components/parts/NotificationItem";
import {
  useFetchNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/api/notification/useFetchNotifications";
import { Button, Badge, Spinner, Alert, Pagination } from "react-bootstrap";
import Loading from "@/components/ui/Loading";

const NotificationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {unreadCount > 0 && (
            <Badge bg="primary" pill>
              {unreadCount} belum dibaca
            </Badge>
          )}
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
