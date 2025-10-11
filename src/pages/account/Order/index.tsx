import AccountLayout from "../../../components/layout/AccountLayout";
import { useFetchOrders } from "../../../services/api/order";
import Pagination from "../../../components/ui/Pagination";
import useFilters from "../../../hooks/useFilters";
import { type ChangeEvent, useState } from "react";
import OrderItem from "../../../components/shared/order/OrderItem";
import Loading from "../../../components/ui/Loading";
import { ORDER_STATUSES } from "../../../utils/constans";
import ConfirmPaymentModal from "../../../components/shared/order/ConfirmPaymentModal";
import ConfirmOrderReceivedModal from "../../../components/shared/order/ConfirmOrderReceivedModal";
import { Button, Form, Offcanvas } from "react-bootstrap";
import NoData from "../../../components/ui/NoData";
import { Helmet } from "react-helmet-async";

const StatusSelect = ({
  onChange,
  className,
}: {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) => (
  <Form.Select
    defaultValue={""}
    className={`d-inline-block cursor-pointer ${className}`}
    onChange={onChange}
  >
    <option value="">All</option>
    {Object.keys(ORDER_STATUSES).map((status) => (
      <option key={status} value={status}>
        {ORDER_STATUSES[status]}
      </option>
    ))}
  </Form.Select>
);

const SortSelect = ({
  onChange,
  className,
}: {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) => {
  return (
    <Form.Select
      defaultValue=""
      onChange={onChange}
      className={`d-inline-block cursor-pointer ${className}`}
    >
      <option value="">Default</option>
      <option value="newest">Terbaru</option>
      <option value="oldest">Terlama</option>
    </Form.Select>
  );
};

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

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      clearFilters("status");
    } else {
      setFilter("status", e.target.value);
    }
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      clearFilters("sort");
    } else {
      setFilter("sort", e.target.value);
    }
  };

  return (
    <AccountLayout title="Pesanan">
      <Helmet>
        <title>Pesanan | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

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

      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Desktop */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          <div>
            <Form.Label className="text-gray-700 mb-0 me-2">Status:</Form.Label>
            <StatusSelect onChange={handleStatusChange} className="w-auto" />
          </div>
          <div>
            <Form.Label className="text-gray-700 mb-0 me-2">
              Urutkan:
            </Form.Label>
            <SortSelect onChange={handleSortChange} className="w-auto" />
          </div>
        </div>

        <p className="text-gray-700 mb-0">
          {orders?.page?.from || 0} - {orders?.page?.to || 0} dari{" "}
          {orders?.page?.total || 0}
        </p>

        {/* Mobile */}
        <div className="d-flex gap-2 d-lg-none">
          <Button
            size="sm"
            variant="outline-dark"
            onClick={() => setShowSort(true)}
          >
            <i className="bi bi-arrow-down-up"></i>
          </Button>

          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => setShowFilter(true)}
          >
            <i className="bi bi-funnel"></i>
          </Button>

          <Offcanvas
            show={showFilter}
            onHide={() => setShowFilter(false)}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <i className="bi bi-funnel-fill"></i> Filter
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="mb-3">
                <Form.Label>Status</Form.Label>
                <StatusSelect onChange={handleStatusChange} />
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          <Offcanvas
            show={showSort}
            onHide={() => setShowSort(false)}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <i className="bi bi-arrow-down-up"></i> Sort
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <SortSelect
                className="d-blok w-100"
                onChange={handleSortChange}
              />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>

      {isLoading && <Loading className="py-5" />}

      {!isLoading && orders?.data?.length === 0 && <NoData />}

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
