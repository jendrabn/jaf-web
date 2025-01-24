import { useParams } from "react-router";
import AccountLayout from "../../layouts/AccountLayout";
import { useFetchOrder } from "../../services/api/order";
import NotFoundPage from "../NotFoundPage";
import Loading from "../../components/Loading";
import { formatToRupiah } from "../../utils/functions";
import { Alert, Button } from "react-bootstrap";
import { ORDER_STATUS_COLORS, ORDER_STATUSES } from "../../utils/constans";
import ProductImage from "../../components/ProductImage";
import { useState } from "react";
import ConfirmPaymentModal from "../../components/Order/ConfirmPaymentModal";
import ConfirmOrderReceivedModal from "../../components/Order/ConfirmOrderReceivedModal";

// format date example: 18 Jan 2025, 10:00
const formatDate = (date?: string): string => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useFetchOrder(Number(id));

  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [showConfirmOrderReceivedModal, setShowConfirmOrderReceivedModal] =
    useState(false);

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

  if ((!isLoading && !order) || !id) return <NotFoundPage />;

  return (
    <AccountLayout title="Order Detail">
      <ConfirmPaymentModal
        show={showConfirmPaymentModal}
        onClose={handleCloseConfirmPaymentModal}
        orderId={+id!}
      />

      <ConfirmOrderReceivedModal
        orderId={+id!}
        show={showConfirmOrderReceivedModal}
        onClose={handleCloseConfirmOrderDeliveredModal}
      />

      {isLoading && <Loading className="py-5" />}

      {order && (
        <>
          <div className="stepper">
            <div className={`step completed`}>
              <div className="icon">
                <i className="fas fa-check"></i>
              </div>
              <div>Order Created</div>
              <div className="timestamp">{formatDate(order.created_at)}</div>
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
                Order Paid <br /> ({formatToRupiah(order.total_amount)})
              </div>
              <div className="timestamp">{formatDate(order.confirmed_at)}</div>
            </div>
            <div
              className={`step ${
                order.status === "on_delivery" ? "active" : ""
              } ${["completed"].includes(order.status) ? "completed" : ""}`}
            >
              <div className="icon">
                <i className="fas fa-truck"></i>
              </div>
              <div>Order Shipped Out</div>
              <div className="timestamp">{formatDate(order.shipped_at)}</div>
            </div>
            <div
              className={`step ${
                order.status === "completed" ? "active" : ""
              } ${order.status === "completed" ? "completed" : ""}`}
            >
              <div className="icon">
                <i className="fas fa-box"></i>
              </div>
              <div>Order Completed</div>
              <div className="timestamp">{formatDate(order.completed_at)}</div>
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
                    Order Status: <b>{ORDER_STATUSES[order.status]}</b>
                  </small>
                </Alert>
              </div>

              <div className="order__info border-top py-3">
                <div className="row">
                  <div className="col">
                    <strong>Order Date</strong> <br />{" "}
                    {formatDate(order.created_at)}
                  </div>
                  <div className="col border-start border-end">
                    <strong>Order ID</strong> <br /> {order.id}
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
                    <strong>Delivery Address</strong>
                    <br />
                    {order.shipping_address.name} <br />
                    {order.shipping_address.phone} <br />
                    {`${order.shipping_address.address}, ${order.shipping_address.district}, ${order.shipping_address.city}, ${order.shipping_address.province}, ${order.shipping_address.postal_code}`}
                  </div>
                  <div className="col-md-7">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Delivery Service</strong>
                          <br />
                          {`${order.shipping.courier_name} - ${
                            order.shipping.service
                          } (${(order.total_weight / 1000).toFixed(2)} Kg)`}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Shipping Cost</strong>
                          <br />
                          {formatToRupiah(order.shipping_cost)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Tracking Number</strong>
                          <br />
                          {order.shipping.tracking_number || "-"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Delivery Status</strong>
                          <br />
                          {order.shipping.status.toUpperCase() || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className="col-md-4">
                  <p>
                    <strong>Toko</strong>
                    <br />
                    {order.items[0].product.brand.name}
                  </p>
                </div>
                <div className="col-md-4">
                  <p>
                    <strong>Tanggal Pesanan</strong>
                    <br />
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-md-4">
                  <p>
                    <strong>Sales Order</strong>
                    <br />
                    {order.invoice.number}
                  </p>
                </div>
              </div> */}

              <div className="order__product py-3 border-top">
                <ul className="list-unstyled mb-0">
                  {order.items.map((item, index) => (
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
                          url={item.product.image}
                          width={50}
                          alt={item.name}
                          className="me-2"
                        />
                        <div>
                          <p className="mb-0 fw-bold">{item.name}</p>
                          <small className="text-muted">
                            {item.quantity} x {formatToRupiah(item.price)} (
                            {(item.weight / 1000).toFixed(2)} Kg)
                          </small>
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
              </div>

              <div className="order__summary py-3 border-top">
                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Payment Method</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>
                      {order.payment.method.toLocaleUpperCase()} -{" "}
                      {order.invoice.status.toLocaleUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Total Price</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatToRupiah(order.total_price)}</span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Shipping Cost</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatToRupiah(order.shipping_cost)}</span>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-9 text-end">
                    <span>Tax</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span>{formatToRupiah(0)}</span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-9 text-end">
                    <span>Total Amount</span>
                  </div>
                  <div className="col-md-3 text-end">
                    <span className="fw-bold fs-5">
                      {formatToRupiah(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order__action d-flex justify-content-start gap-2">
                {order.status === "on_delivery" && (
                  <Button
                    variant="success"
                    onClick={handleShowConfirmOrderReceivedModal}
                  >
                    Order Received
                  </Button>
                )}
                {order.status === "pending_payment" && (
                  <Button
                    variant="primary"
                    onClick={handleShowConfirmPaymentModal}
                  >
                    Confirm Payment
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
