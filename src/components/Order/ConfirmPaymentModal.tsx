import { Button, Form, Modal } from "react-bootstrap";
import { useConfirmPayment } from "../../services/api/order";
import { FormEvent } from "react";
import useForm from "../../hooks/useForm";
import { ConfirmPaymentReqTypes } from "../../types/order";
import ErrorValidationAlert from "../ErrorValidationAlert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  const { mutate, error, reset, isPending } = useConfirmPayment();
  const { values, handleChange } = useForm<ConfirmPaymentReqTypes>({
    name: "",
    account_name: "",
    account_number: "",
  });

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();

    if (!orderId) return;

    mutate(
      { orderId, data: values },
      {
        onSuccess() {
          toast.success("Payment has been confirmed.");

          queryClient.invalidateQueries({ queryKey: ["orders"] });

          onClose?.();
        },
      }
    );
  };

  const handleClose = () => {
    reset();

    onClose();
  };

  return (
    <Modal show={show} centered onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Confirm Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorValidationAlert error={error} onClose={reset} />
        <Form onSubmit={handleConfirm}>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={handleChange}
              value={values.name}
            />
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

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isPending}>
              Confirm
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmPaymentModal;
