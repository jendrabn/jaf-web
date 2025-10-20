import { useParams } from "react-router";
import AccountLayout from "../../../components/layouts/AccountLayout";
import { useFetchOrder } from "../../../hooks/api/order";
import NotFoundPage from "../../../pages/NotFound";
import Loading from "../../../components/ui/Loading";
import { formatDateTime } from "../../../utils/functions";
import { Alert, Button } from "react-bootstrap";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUSES,
  PAYMENT_METHOD_GATEWAY,
} from "../../../utils/constans";
import ProductImage from "../../../components/parts/ProductImage";
import { useState, useEffect, useRef, useCallback } from "react";
import ConfirmPaymentModal from "../../../components/parts/Order/ConfirmPaymentModal";
import ConfirmOrderReceivedModal from "../../../components/parts/Order/ConfirmOrderReceivedModal";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import AddRatingModal from "../../../components/parts/Order/AddRatingModal";
import { formatCurrency } from "@/utils/format";
import { env } from "@/utils/config";
import { loadSnapScript, payWithSnap } from "@/lib/midtrans";
import { toast } from "react-toastify";
import type { PaymentInfoTypes } from "@/types/order";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constans";
import PayNowButton from "../../../components/parts/Order/PayNowButton";
import TrackingModal from "../../../components/parts/Order/TrackingModal";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, refetch } = useFetchOrder(Number(id));
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hasAutoOpenedRef = useRef(false);

  const isGateway = order?.payment?.method === PAYMENT_METHOD_GATEWAY;
  const isUnpaid = order
    ? ["pending", "pending_payment"].includes(order.status)
    : false;
  const canOpenSnap = !!(isGateway && isUnpaid);

  const openSnap = useCallback(async () => {
    const info: PaymentInfoTypes | undefined = order?.payment?.info;
    const clientKey: string | undefined = info?.client_key;
    const snapToken: string | undefined = info?.snap_token;
    const redirectUrl: string | undefined = info?.redirect_url;
    const resolvedOrderId: number | undefined = order?.id ?? Number(id);

    if (clientKey && snapToken) {
      try {
        await loadSnapScript({
          env: (env.MIDTRANS_ENV as "sandbox" | "production") || "sandbox",
          clientKey,
        });
        payWithSnap(snapToken, {
          onSuccess: async () => {
            await refetch();
            if (resolvedOrderId) {
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ORDER, resolvedOrderId],
              });
            }
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
          },
          onPending: async () => {
            await refetch();
            if (resolvedOrderId) {
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ORDER, resolvedOrderId],
              });
            }
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
          },
          onError: () => {
            toast.error(
              "Pembayaran gagal. Silakan coba lagi atau pilih metode lain."
            );
          },
          onClose: () => {},
        });
      } catch {
        toast.error("Gagal memuat Midtrans Snap.");
      }
    } else if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      toast.error("Informasi pembayaran Midtrans tidak tersedia.");
    }
  }, [order, refetch, id, queryClient]);

  useEffect(() => {
    const state = location.state;
    const newOrderCreated = !!(
      state &&
      typeof state === "object" &&
      "new_order_created" in state &&
      (state as { new_order_created?: boolean }).new_order_created
    );

    const key = `snap_auto_opened_${id}`;
    const alreadyOpened = sessionStorage.getItem(key) === "1";

    if (
      newOrderCreated &&
      canOpenSnap &&
      !hasAutoOpenedRef.current &&
      !alreadyOpened
    ) {
      hasAutoOpenedRef.current = true;
      sessionStorage.setItem(key, "1");
      openSnap();

      // Hapus state history agar refresh tidak memicu auto-open lagi
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, canOpenSnap, openSnap, id, navigate, location.pathname]);

  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(
    !!location.state?.new_order_created
  );
  const [showConfirmOrderReceivedModal, setShowConfirmOrderReceivedModal] =
    useState(false);

  const [showTrackingModal, setShowTrackingModal] = useState(false);
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
        <title>Detail Pesanan | {env.APP_NAME}</title>
      </Helmet>
      {/* <OrderSuccessModal /> */}

      {order && (
        <>
          {order.payment.method !== PAYMENT_METHOD_GATEWAY && (
            <ConfirmPaymentModal
              show={showConfirmPaymentModal}
              onClose={handleCloseConfirmPaymentModal}
              orderId={order.id}
            />
          )}
          <ConfirmOrderReceivedModal
            orderId={order.id}
            show={showConfirmOrderReceivedModal}
            onClose={handleCloseConfirmOrderDeliveredModal}
          />
          <TrackingModal
            orderId={order.id}
            show={showTrackingModal}
            onClose={() => setShowTrackingModal(false)}
          />
        </>
      )}

      {order && (
        <>
          <div className="stepper">
            <div className={`step completed`}>
              <div className="icon">
                <i className="bi bi-check-lg"></i>
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
                <i className="bi bi-check-lg"></i>
              </div>
              <div>
                Pesanan Dibayar <br /> ({formatCurrency(order.total_amount)})
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
                <i className="bi bi-truck"></i>
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
                <i className="bi bi-box"></i>
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
                          {formatCurrency(order.shipping_cost)}
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
                                    {formatCurrency(unitPrice)}
                                  </span>
                                  (
                                  <span className="text-decoration-line-through text-muted">
                                    {formatCurrency(originalPrice)}
                                  </span>
                                  {discountLabel && (
                                    <span className="ms-1">
                                      {discountLabel}
                                    </span>
                                  )}
                                  )
                                </>
                              ) : (
                                formatCurrency(unitPrice)
                              )}{" "}
                              ({(weight / 1000).toFixed(2)} Kg)
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          {isDiscounted ? (
                            <div className="d-flex flex-column align-items-end">
                              <span style={{ fontSize: "0.9rem" }}>
                                {formatCurrency(subtotal)}
                              </span>
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
                    <span>{formatCurrency(order.total_price)}</span>
                  </div>
                </div>

                {order.discount > 0 && (
                  <div className="row mb-2">
                    <div className="col-md-9 text-end">
                      <span>Diskon</span>
                    </div>
                    <div className="col-md-3 text-end">
                      <span className="text-success">
                        -{formatCurrency(order.discount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Ongkos Kirim</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Pajak</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                </div>

                {isGateway && (order.gateway_fee ?? 0) > 0 && (
                  <div className="row mb-2">
                    <div className="col-md-9 text-end">
                      <span>
                        {order.gateway_fee_name || "Biaya Payment Gateway"}
                      </span>
                    </div>
                    <div className="col-md-3 text-end">
                      <span>{formatCurrency(order.gateway_fee || 0)}</span>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-9 text-end">
                    <span>Total Bayar</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span className="fw-bold fs-5">
                      {formatCurrency(order.total_amount)}
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
                  <>
                    <Button
                      variant="success"
                      onClick={handleShowConfirmOrderReceivedModal}
                    >
                      Pesanan Diterima
                    </Button>
                  </>
                )}
                {(order.status === "on_delivery" ||
                  order.status === "completed") && (
                  <Button
                    variant="primary"
                    onClick={() => setShowTrackingModal(true)}
                  >
                    Lacak Pesanan
                  </Button>
                )}

                {isGateway && isUnpaid && <PayNowButton order={order} />}
                {!isGateway && order.status === "pending_payment" && (
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
};

export default OrderDetailPage;
