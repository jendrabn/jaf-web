import { Button, Form, Modal } from "react-bootstrap";
import { useConfirmPayment, useFetchOrder } from "../../services/api/order";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import ErrorValidationAlert from "../ErrorValidationAlert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import bankList from "../../assets/bank-list.json";
import CheckIcon from "../../assets/check-complete-done.svg";
import { useLocation, useNavigate } from "react-router";
import Loading from "../Loading";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_EWALLET,
  QUERY_KEYS,
} from "../../utils/constans";
import type { ConfirmPaymentReqTypes } from "../../types/order";
import PaymentInfo from "./PaymentInfo";

interface ConfirmPaymentModalProps {
  show: boolean;
  orderId: number | null;
  onClose: () => void;
}

function ConfirmPaymentModal({
  show,
  orderId,
  onClose,
}: ConfirmPaymentModalProps) {
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useFetchOrder(orderId!);

  const { mutate, error, reset, isPending } = useConfirmPayment();
  const { values, handleChange, setValue } = useForm<ConfirmPaymentReqTypes>({
    name: "",
    account_name: "",
    account_number: "",
    account_username: "",
    phone: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  // clear state
  const clearState = useCallback(() => {
    if (location.state?.new_order_created)
      navigate(location.pathname, { state: null });
  }, [location.state?.new_order_created, location.pathname, navigate]);

  const [showOrderSuccess, setShowOrderSuccess] = useState(
    !!location.state?.new_order_created
  );

  useEffect(() => {
    if (order && order.payment?.method === PAYMENT_METHOD_EWALLET) {
      // Check if the current value is different from the new value
      if (values.name !== order.payment.info.name) {
        setValue("name", order.payment.info.name || "");
      }
    }
  }, [order, values.name, setValue]);

  useEffect(() => {
    clearState();
  }, [clearState, location]);

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    if (!orderId) return;

    console.log(values);

    mutate(
      { orderId, data: values },
      {
        onSuccess() {
          toast.success("Payment has been confirmed.");

          onClose?.();

          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.ORDER, orderId],
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();

    onClose();

    setShowOrderSuccess(false);

    clearState();
  };

  return (
    <Modal
      show={show}
      centered
      onHide={handleClose}
      backdrop="static"
      animation
    >
      <Modal.Header closeButton>
        <Modal.Title>Payment Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3">
        {isLoading && show && <Loading className="py-5" />}

        {order && (
          <>
            {showOrderSuccess && (
              <div className="text-center mb-3">
                <img
                  src={CheckIcon}
                  alt="Check Complete"
                  className="mb-1"
                  style={{ width: "100%", maxWidth: 100 }}
                />
                <p className="mb-0 fs-6">Create order has been successful</p>
              </div>
            )}

            <PaymentInfo
              paymentDueDate={order.payment_due_date}
              payment={order.payment}
            />

            <p className="text-muted text-center">
              Confirm your payment by filling in the form below. We will verify
              your payment as soon as possible
            </p>

            <ErrorValidationAlert error={error} onClose={reset} />

            <Form onSubmit={handleConfirm}>
              <fieldset disabled={isPending}>
                {order?.payment?.method === PAYMENT_METHOD_BANK && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Name</Form.Label>
                      <Form.Select
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        autoFocus
                      >
                        <option>Choose Bank</option>
                        {bankList.map((bank) => (
                          <option key={bank.id} value={bank.name}>
                            {bank.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_name"
                        onChange={handleChange}
                        value={values.account_name}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_number"
                        onChange={handleChange}
                        value={values.account_number}
                      />
                    </Form.Group>
                  </>
                )}

                {order?.payment?.method === PAYMENT_METHOD_EWALLET && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>E-Wallet</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={order?.payment?.info?.name}
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_name"
                        onChange={handleChange}
                        autoFocus
                        value={values.account_name}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_username"
                        onChange={handleChange}
                        value={values.account_username}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        onChange={handleChange}
                        value={values.phone}
                      />
                    </Form.Group>
                  </>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" onClick={handleClose}>
                    Confirm Later
                  </Button>
                  <Button variant="primary" type="submit">
                    Confirm Payment
                  </Button>
                </div>
              </fieldset>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmPaymentModal;
