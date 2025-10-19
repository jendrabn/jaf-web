import { Link } from "react-router";
import { type OrderTypes } from "@/types/order";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUSES,
  PAYMENT_METHOD_GATEWAY,
} from "@/utils/constans";
import { formatCurrency, formatSimpleDateTime } from "@/utils/format";
import { Alert, Badge, Button } from "react-bootstrap";
import ProductImage from "@/components/parts/ProductImage";
import AddRatingModal from "@/components/parts/Order/AddRatingModal";
import { useState } from "react";
import PayNowButton from "@/components/parts/Order/PayNowButton";

interface OrderItemProps {
  order: OrderTypes;
  onConfirmPayment: (orderId: number) => void;
  onConfirmOrderReceived: (orderId: number) => void;
}

const OrderItem = (props: OrderItemProps) => {
  const { order, onConfirmPayment, onConfirmOrderReceived } = props;
  const { id, status, created_at, payment_due_date, items, total_amount } =
    order;

  const isGateway = order?.payment?.method === PAYMENT_METHOD_GATEWAY;

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
              {/* <span className="fw-semibold me-2">Order #{id}</span> */}
              <small className="text-muted">
                {formatSimpleDateTime(created_at)}
              </small>
            </div>
            <div>
              <Badge bg={ORDER_STATUS_COLORS[status]}>
                {ORDER_STATUSES[status]}
              </Badge>
            </div>
          </div>

          {/* Alert Payment Due Date */}
          {status === "pending_payment" && (
            <Alert variant="light" className="mt-2 p-2">
              <p className="mb-0">
                Bayar Sebelum
                <span className="ms-2 fw-semibold text-danger">
                  <i className="bi bi-stopwatch me-1"></i>
                  {formatSimpleDateTime(payment_due_date)}
                </span>
              </p>
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
                            <span className="text-danger me-1">
                              {formatCurrency(unitPrice)}
                            </span>
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatCurrency(originalPrice)}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </>
                        ) : (
                          formatCurrency(unitPrice)
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
                        <span>{formatCurrency(subtotal)}</span>
                        <small className="text-gray-600">
                          (
                          <span className="text-decoration-line-through text-muted">
                            {formatCurrency(originalSubtotal)}
                          </span>
                          {discountLabel && (
                            <span className="ms-1">{discountLabel}</span>
                          )}
                          )
                        </small>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.9rem" }}>
                        {formatCurrency(subtotal)}
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
            <span className="fw-bold">{formatCurrency(total_amount)}</span>
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
                  onClick={handleShowRatingModal}
                >
                  {items.every((item) => item.rating)
                    ? "Edit Penilaian"
                    : "Beri Penilaian"}
                </Button>
              </>
            )}

            {isGateway &&
              (status === "pending" || status === "pending_payment") && (
                <PayNowButton size="sm" orderId={id} />
              )}

            {!isGateway && status === "pending_payment" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onConfirmPayment(id)}
              >
                Konfirmasi Pembayaran
              </Button>
            )}

            {status === "on_delivery" && (
              <Button
                variant="success"
                size="sm"
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
