import { Link } from "react-router";
import { OrderTypes } from "../../types/order";
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from "../../utils/constans";
import { formatToRupiah } from "../../utils/functions";
import { Alert, Button } from "react-bootstrap";
import ProductImage from "../ProductImage";

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatPaymentDueDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

interface OrderItemProps {
  order: OrderTypes;
  onConfirmPayment: (orderId: number) => void;
  onConfirmOrderReceived: (orderId: number) => void;
}

function OrderItem({
  order: { id, status, created_at, payment_due_date, items, total_amount },
  onConfirmPayment,
  onConfirmOrderReceived,
}: OrderItemProps) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <Link
          className="text-decoration-none text-reset"
          to={`/account/orders/${id}`}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
            <div>
              <span className="fw-bold me-2">Order ID: {id}</span>
              <small className="text-muted">{formatDate(created_at)}</small>
            </div>
            <div>
              <span
                className={`badge rounded-0 text-bg-${ORDER_STATUS_COLORS[status]}`}
              >
                {ORDER_STATUSES[status]}
              </span>
            </div>
          </div>
          {/* Alert Payment Due Date */}
          {status === "pending_payment" && (
            <Alert variant="danger" className="p-2">
              <small>
                Payment Due Date: {formatPaymentDueDate(payment_due_date)}
              </small>
            </Alert>
          )}

          {/* Order Items image, quantity, and price */}
          <ul className="list-unstyled mt-2">
            {items.map((item, index) => (
              <li
                key={`order-item-${item.id}`}
                className={`d-flex justify-content-between align-items-center mb-2 ${
                  index !== items.length - 1 ? "pb-2" : ""
                }`}
              >
                <div className="d-flex align-items-center">
                  <ProductImage
                    url={item.product.image}
                    width={50}
                    alt={item.name}
                    className="me-2"
                  />
                  <div>
                    <p className="mb-0">{item.name}</p>
                    <small className="text-muted">x {item.quantity}</small>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.9rem" }}>
                    {formatToRupiah(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Link>

        <div className="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            {status === "pending_payment" && (
              <Button
                variant="primary"
                size="sm"
                className="me-2 rounded-0"
                onClick={() => onConfirmPayment(id)}
              >
                Confirm Payment
              </Button>
            )}

            {status === "on_delivery" && (
              <Button
                variant="success"
                size="sm"
                className="rounded-0"
                onClick={() => onConfirmOrderReceived(id)}
              >
                Order Received
              </Button>
            )}
          </div>
          <div>
            <span className="fw-bold me-2">Total Amount:</span>
            <span className="fw-bold">{formatToRupiah(total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;
