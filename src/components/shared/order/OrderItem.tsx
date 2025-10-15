import { Link } from "react-router";
import { type OrderTypes } from "../../../types/order";
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from "../../../utils/constans";
import { formatPrice } from "../../../utils/functions";
import { Alert, Button } from "react-bootstrap";
import ProductImage from "../ProductImage";
import AddRatingModal from "./AddRatingModal";
import { useState } from "react";

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("id-ID", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatPaymentDueDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("id-ID", { month: "long" });
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

const OrderItem = (props: OrderItemProps) => {
  const { order, onConfirmPayment, onConfirmOrderReceived } = props;
  const { id, status, created_at, payment_due_date, items, total_amount } =
    order;

  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleShowRatingModal = () => {
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
  };

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
                Batas waktu pembayaran: {formatPaymentDueDate(payment_due_date)}
              </small>
            </Alert>
          )}

          {/* Order Items image, quantity, and price */}
          <ul className="list-unstyled mt-2">
            {items.map((item, index) => {
              const {
                product,
                price,
                price_after_discount,
                discount_in_percent,
                quantity,
              } = item;

              const originalPrice = price ?? 0;
              const discountedPrice = price_after_discount ?? originalPrice;

              const discountPercent =
                typeof discount_in_percent === "number"
                  ? Math.max(Math.round(discount_in_percent), 0)
                  : originalPrice > 0 && discountedPrice < originalPrice
                  ? Math.max(
                      Math.round(
                        ((originalPrice - discountedPrice) / originalPrice) *
                          100
                      ),
                      0
                    )
                  : null;

              const isDiscounted =
                discountPercent != null &&
                discountPercent > 0 &&
                discountedPrice < originalPrice;

              const unitPrice = isDiscounted ? discountedPrice : originalPrice;
              const subtotal = unitPrice * quantity;
              const originalSubtotal = originalPrice * quantity;

              const discountLabel =
                discountPercent && discountPercent > 0
                  ? `-${discountPercent}%`
                  : null;

              return (
                <li
                  key={`order-item-${item.id}`}
                  className={`d-flex justify-content-between align-items-center mb-2 ${
                    index !== items.length - 1 ? "pb-2" : ""
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <ProductImage
                      url={product.image}
                      width={50}
                      alt={item.name}
                      className="me-2"
                    />
                    <div>
                      <p className="mb-0">{item.name}</p>
                      <small className="text-muted">
                        {quantity} x{" "}
                        {isDiscounted ? (
                          <>
                            <span className="text-danger">
                              {formatPrice(unitPrice)}
                            </span>
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatPrice(originalPrice)}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </>
                        ) : (
                          formatPrice(unitPrice)
                        )}
                      </small>
                    </div>
                  </div>
                  <div>
                    {isDiscounted ? (
                      <div
                        className="d-flex flex-column align-items-end"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <span>{formatPrice(subtotal)}</span>
                        <small className="text-gray-600">
                          (
                          <span className="text-decoration-line-through text-muted">
                            {formatPrice(originalSubtotal)}
                          </span>
                          {discountLabel && (
                            <span className="ms-1">{discountLabel}</span>
                          )}
                          )
                        </small>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.9rem" }}>
                        {formatPrice(subtotal)}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Link>

        <div className="d-flex flex-column flex-lg-row flex-lg-row-reverse justify-content-between border-top pt-2">
          <div className="d-flex justify-content-end align-items-center mb-2 mb-lg-0">
            <span className="text-secondary-emphasis me-2">Jumlah Total:</span>
            <span className="fw-bold">{formatPrice(total_amount)}</span>
          </div>

          <div className="d-flex gap-2 jutsify-content-start">
            <AddRatingModal
              order={order}
              show={showRatingModal}
              onClose={handleCloseRatingModal}
            />

            {status === "completed" && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-0"
                  onClick={handleShowRatingModal}
                >
                  {items.every((item) => item.rating)
                    ? "Edit Penilaian"
                    : "Beri Penilaian"}
                </Button>
              </>
            )}

            {status === "pending_payment" && (
              <Button
                variant="primary"
                size="sm"
                className="rounded-0"
                onClick={() => onConfirmPayment(id)}
              >
                Konfirmasi Pembayaran
              </Button>
            )}

            {status === "on_delivery" && (
              <Button
                variant="success"
                size="sm"
                className="rounded-0"
                onClick={() => onConfirmOrderReceived(id)}
              >
                Pesanan Selesai
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
