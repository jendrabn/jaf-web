import { useParams } from "react-router";
import AccountLayout from "../../layouts/AccountLayout";
import { useFetchOrder } from "../../services/api/order";
import NotFoundPage from "../NotFoundPage";
import Loading from "../../components/Loading";
import { formatDateTime, formatPrice } from "../../utils/functions";
import { Alert, Button } from "react-bootstrap";
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from "../../utils/constans";
import ProductImage from "../../components/ProductImage";
import { useState } from "react";
import ConfirmPaymentModal from "../../components/Order/ConfirmPaymentModal";
import ConfirmOrderReceivedModal from "../../components/Order/ConfirmOrderReceivedModal";
import { useLocation } from "react-router";
import { Helmet } from "react-helmet-async";
import AddRatingModal from "../../components/Order/AddRatingModal";

function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useFetchOrder(Number(id));
  const location = useLocation();

  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(
    !!location.state?.new_order_created
  );
  const [showConfirmOrderReceivedModal, setShowConfirmOrderReceivedModal] =
    useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleShowConfirmPaymentModal = () => {
    setShowConfirmPaymentModal(true);
  };

  const handleCloseConfirmPaymentModal = () => {
    setShowConfirmPaymentModal(false);
  };

  const handleShowConfirmOrderReceivedModal = () => {
    setShowConfirmOrderReceivedModal(true);
  };

  const handleCloseConfirmOrderDeliveredModal = () => {
    setShowConfirmOrderReceivedModal(false);
  };

  const handleShowRatingModal = () => {
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
  };

  if (isLoading) return <Loading className="min-vh-100" />;

  if (!isLoading && !order) return <NotFoundPage />;

  return (
    <AccountLayout title="Detail Pesanan">
      <Helmet>
        <title>Detail Pesanan | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      {/* <OrderSuccessModal /> */}

      {order && (
        <>
          <ConfirmPaymentModal
            show={showConfirmPaymentModal}
            onClose={handleCloseConfirmPaymentModal}
            orderId={order.id}
          />
          <ConfirmOrderReceivedModal
            orderId={order.id}
            show={showConfirmOrderReceivedModal}
            onClose={handleCloseConfirmOrderDeliveredModal}
          />
        </>
      )}

      {order && (
        <>
          <div className="stepper">
            <div className={`step completed`}>
              <div className="icon">
                <i className="fas fa-check"></i>
              </div>
              <div>Pesanan Dibuat</div>
              <div className="timestamp">
                {formatDateTime(order.created_at)}
              </div>
            </div>
            <div
              className={`step ${order.status === "pending" ? "active" : ""} ${
                ["processing", "on_delivery", "completed"].includes(
                  order.status
                )
                  ? "completed"
                  : ""
              }`}
            >
              <div className="icon">
                <i className="fas fa-check"></i>
              </div>
              <div>
                Pesanan Dibayar <br /> ({formatPrice(order.total_amount)})
              </div>
              <div className="timestamp">
                {formatDateTime(order.confirmed_at)}
              </div>
            </div>
            <div
              className={`step ${
                order.status === "on_delivery" ? "active" : ""
              } ${["completed"].includes(order.status) ? "completed" : ""}`}
            >
              <div className="icon">
                <i className="fas fa-truck"></i>
              </div>
              <div>Pesanan Dikirim</div>
              <div className="timestamp">
                {formatDateTime(order.shipped_at)}
              </div>
            </div>
            <div
              className={`step ${
                order.status === "completed" ? "active" : ""
              } ${order.status === "completed" ? "completed" : ""}`}
            >
              <div className="icon">
                <i className="fas fa-box"></i>
              </div>
              <div>Pesanan Selesai</div>
              <div className="timestamp">
                {formatDateTime(order.completed_at)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="order__status">
                <Alert
                  variant={ORDER_STATUS_COLORS[order.status]}
                  className="p-2"
                >
                  <small>
                    Status Pesanan: <b>{ORDER_STATUSES[order.status]}</b>
                  </small>
                </Alert>
              </div>

              <div className="order__info border-top py-3">
                <div className="row">
                  <div className="col">
                    <strong>Tanggal Pesanan</strong> <br />{" "}
                    {formatDateTime(order.created_at)}
                  </div>
                  <div className="col border-start border-end">
                    <strong>ID Pesanan</strong> <br /> {order.id}
                  </div>
                  <div className="col">
                    <strong>Invoice</strong>
                    <br />
                    {order.invoice.number}
                  </div>
                </div>
              </div>

              <div className="order__address border-top py-3">
                <div className="row">
                  <div className="col-md-5 border-end">
                    <strong>Alamat Pengiriman</strong>
                    <br />
                    {order.shipping_address.name} <br />
                    {order.shipping_address.phone} <br />
                    {`${order.shipping_address.address}, ${order.shipping_address.district}, ${order.shipping_address.city}, ${order.shipping_address.province}, ${order.shipping_address.postal_code}`}
                  </div>
                  <div className="col-md-7">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Jasa Pengiriman</strong>
                          <br />
                          {`${order.shipping.courier_name} - ${
                            order.shipping.service
                          } (${(order.total_weight / 1000).toFixed(2)} Kg)`}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Ongkos Kirim</strong>
                          <br />
                          {formatPrice(order.shipping_cost)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Nomor Resi</strong>
                          <br />
                          {order.shipping.tracking_number || "-"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Status Pengiriman</strong>
                          <br />
                          {order.shipping.status.toUpperCase() || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order__payment border-top py-3">
                <div className="row">
                  <div className="col border-end d-flex justify-content-between">
                    <div>
                      <strong>Metode Pembayaran</strong> <br />
                      {order.payment.method.toUpperCase()} -{" "}
                      {order.payment.info.name}
                    </div>
                  </div>
                  <div className="col">
                    <strong>Status Pembayaran</strong> <br />
                    {order.invoice.status.toUpperCase()}
                    {order.status === "pending_payment" && (
                      <>
                        <br />
                        <span className="text-danger">
                          {`Batas waktu pembayaran ${formatDateTime(
                            order.payment_due_date
                          )}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="order__product py-3 border-top">
                <ul className="list-unstyled mb-0">
                  {order.items.map((item, index) => {
                    const {
                      product,
                      price,
                      price_after_discount,
                      discount_in_percent,
                      quantity,
                      weight,
                    } = item;

                    const originalPrice = price ?? 0;
                    const discountedPrice =
                      price_after_discount ?? originalPrice;

                    const discountPercent =
                      typeof discount_in_percent === "number"
                        ? Math.max(Math.round(discount_in_percent), 0)
                        : originalPrice > 0 && discountedPrice < originalPrice
                        ? Math.max(
                            Math.round(
                              ((originalPrice - discountedPrice) /
                                originalPrice) *
                                100
                            ),
                            0
                          )
                        : null;

                    const isDiscounted =
                      discountPercent != null &&
                      discountPercent > 0 &&
                      discountedPrice < originalPrice;

                    const unitPrice = isDiscounted
                      ? discountedPrice
                      : originalPrice;
                    const subtotal = unitPrice * quantity;
                    const originalSubtotal = originalPrice * quantity;

                    const discountLabel =
                      discountPercent && discountPercent > 0
                        ? `-${discountPercent}%`
                        : null;

                    return (
                      <li
                        key={`order-item-${item.id}`}
                        className={`d-flex justify-content-between align-items-center ${
                          index !== order.items.length - 1
                            ? "border-bottom mb-2 pb-2"
                            : ""
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
                            <p className="mb-0 fw-bold">{item.name}</p>
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
                                    <span className="ms-1">
                                      {discountLabel}
                                    </span>
                                  )}
                                  )
                                </>
                              ) : (
                                formatPrice(unitPrice)
                              )}{" "}
                              ({(weight / 1000).toFixed(2)} Kg)
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          {isDiscounted ? (
                            <div className="d-flex flex-column align-items-end">
                              <span style={{ fontSize: "0.9rem" }}>
                                {formatPrice(subtotal)}
                              </span>
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
                <p className="mt-3 mb-0 border-top border-bottom py-2">
                  <b>Catatan:</b> {order.note || "-"}
                </p>
              </div>

              <div className="order__summary py-3">
                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Total Harga</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatPrice(order.total_price)}</span>
                  </div>
                </div>

                {order.discount > 0 && (
                  <div className="row mb-2">
                    <div className="col-md-9 text-end">
                      <span>Diskon</span>
                    </div>
                    <div className="col-md-3 text-end">
                      <span className="text-success">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Ongkos Kirim</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Pajak</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatPrice(order.tax_amount)}</span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-9 text-end">
                    <span>Total Bayar</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span className="fw-bold fs-5">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order__action d-flex justify-content-start gap-2">
                {order.status === "completed" && (
                  <>
                    <Button
                      variant="primary"
                      className="rounded-0"
                      onClick={handleShowRatingModal}
                    >
                      {order.items.every((item) => item.rating)
                        ? "Edit Penilaian"
                        : "Beri Penilaian"}
                    </Button>
                    <AddRatingModal
                      show={showRatingModal}
                      onClose={handleCloseRatingModal}
                      order={order}
                    />
                  </>
                )}

                {order.status === "on_delivery" && (
                  <Button
                    variant="success"
                    onClick={handleShowConfirmOrderReceivedModal}
                  >
                    Pesanan Diterima
                  </Button>
                )}
                {order.status === "pending_payment" && (
                  <Button
                    variant="primary"
                    onClick={handleShowConfirmPaymentModal}
                  >
                    Konfirmasi Pembayaran
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AccountLayout>
  );
}

export default OrderDetailPage;
