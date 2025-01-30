import AccountLayout from "../../layouts/AccountLayout";
import { useFetchOrders } from "../../services/api/order";
import Pagination from "../../components/Pagination";
import useFilters from "../../hooks/useFilters";
import { ChangeEvent, useState } from "react";
import OrderItem from "../../components/Order/OrderItem";
import Loading from "../../components/Loading";
import { ORDER_STATUSES } from "../../utils/constans";
import ConfirmPaymentModal from "../../components/Order/ConfirmPaymentModal";
import ConfirmOrderReceivedModal from "../../components/Order/ConfirmOrderReceivedModal";

function OrderPage() {
  const { setFilter, clearFilters, queryString } = useFilters();
  const { data: orders, isLoading } = useFetchOrders(queryString);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [showConfirmOrderReceivedModal, setShowConfirmOrderReceivedModal] =
    useState(false);

  const handleShowConfirmPaymentModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowConfirmPaymentModal(true);
  };

  const handleCloseConfirmPaymentModal = () => {
    setShowConfirmPaymentModal(false);

    setTimeout(() => setSelectedOrderId(null), 100);
  };

  const handleShowConfirmOrderReceivedModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowConfirmOrderReceivedModal(true);
  };

  const handleCloseConfirmOrderDeliveredModal = () => {
    setSelectedOrderId(null);
    setShowConfirmOrderReceivedModal(false);
  };

  return (
    <AccountLayout title="My Orders">
      <ConfirmPaymentModal
        show={showConfirmPaymentModal}
        onClose={handleCloseConfirmPaymentModal}
        orderId={selectedOrderId}
      />

      <ConfirmOrderReceivedModal
        orderId={selectedOrderId}
        show={showConfirmOrderReceivedModal}
        onClose={handleCloseConfirmOrderDeliveredModal}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="me-2 fw-bold">Status</span>
          <select
            className="form-select w-auto d-inline-block"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              if (e.target.value === "") {
                clearFilters("status");
              } else {
                setFilter("status", e.target.value);
              }
            }}
          >
            <option value="">All</option>
            {Object.keys(ORDER_STATUSES).map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUSES[status]}
              </option>
            ))}
          </select>

          <span className="ms-2 fw-bold me-2">Sort by</span>
          <select
            className="form-select w-auto d-inline-block"
            onChange={(e) => setFilter("sort_by", e.target.value)}
          >
            <option value="newest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <p className="text-gray-700 mb-0">
          Showing {orders?.data?.length || 0} of {orders?.page?.total || 0}{" "}
          orders
        </p>
      </div>

      {isLoading && <Loading className="py-5" />}

      {!isLoading && orders?.data?.length === 0 && (
        <p className="text-gray-700 text-center py-5 mb-0">No orders found</p>
      )}

      {orders?.data && orders?.data?.length > 0 && (
        <>
          <div>
            {orders?.data?.map((order) => (
              <OrderItem
                onConfirmOrderReceived={handleShowConfirmOrderReceivedModal}
                key={`order-${order.id}`}
                order={order}
                onConfirmPayment={handleShowConfirmPaymentModal}
              />
            ))}
          </div>

          {orders?.page && (
            <Pagination
              {...orders.page}
              onClick={(page) => {
                setFilter("page", page);
              }}
            />
          )}
        </>
      )}
    </AccountLayout>
  );
}

export default OrderPage;
