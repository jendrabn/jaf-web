import type { KeyboardEvent } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import type { Notification } from "@/types/notification";
import { formatDateTime } from "@/utils/functions";
import { headline } from "@/utils/format";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "danger";
      case "info":
      default:
        return "info";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return "bi-check-circle-fill";
      case "warning":
        return "bi-exclamation-triangle-fill";
      case "error":
        return "bi-x-circle-fill";
      case "info":
      default:
        return "bi-info-circle-fill";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "order":
        return "bi-box-seam";
      case "payment":
        return "bi-credit-card";
      case "shipping":
        return "bi-truck";
      case "promotion":
        return "bi-tag";
      case "account":
        return "bi-person";
      default:
        return "bi-bell";
    }
  };

  const isNavigable = Boolean(notification.url);

  const handleNavigate = () => {
    if (isNavigable && notification.url) {
      navigate(notification.url);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isNavigable) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <Card
      className={`mb-3 notification-item ${
        !notification.is_read ? "border-primary bg-light" : ""
      }`}
      style={{ cursor: isNavigable ? "pointer" : "default" }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role={isNavigable ? "button" : undefined}
      tabIndex={isNavigable ? 0 : undefined}
    >
      <Card.Body className="p-3">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <h6 className="fw-semibold mb-1">
                  {headline(notification.title)}
                </h6>
                <Badge
                  bg={getLevelVariant(notification.level)}
                  className="me-2"
                  pill
                >
                  <i
                    className={`bi ${getLevelIcon(notification.level)} me-1`}
                  ></i>
                  {notification.level}
                </Badge>
                <Badge bg="secondary" className="me-2" pill>
                  <i
                    className={`bi ${getCategoryIcon(
                      notification.category
                    )} me-1`}
                  ></i>
                  {notification.category}
                </Badge>
              </div>

              <div className="text-end ms-2">
                <small className="text-muted d-block">
                  {formatDateTime(notification.created_at)}
                </small>
              </div>
            </div>

            <p className="mb-2 text-muted">{notification.body}</p>

            <div className="d-flex justify-content-end align-items-center gap-2">
              {!notification.is_read && onMarkAsRead && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <i className="bi bi-check2 me-1"></i>
                  Tandai dibaca
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotificationItem;
