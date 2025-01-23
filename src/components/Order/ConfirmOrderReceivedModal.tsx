import { Button, Modal } from "react-bootstrap";
import { useConfirmOrderReceived } from "../../services/api/order";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ConfirmOrderReceivedModalProps {
  orderId: number | null;
  show: boolean;
  onClose: () => void;
}

function ConfirmOrderReceivedModal({
  orderId,
  show,
  onClose,
}: ConfirmOrderReceivedModalProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useConfirmOrderReceived();

  const handleConfirm = () => {
    if (!orderId) return;

    mutate(orderId, {
      onSuccess() {
        toast.success("Order has been confirmed.");

        queryClient.invalidateQueries({ queryKey: ["orders"] });

        onClose();
      },
    });
  };

  return (
    <Modal onHide={() => onClose()} show={show} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>Confirm Order Received</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Check that you received all items in satisfactory condition (no
          return/refund required) before confirming receipt. Once you confirm,
          the order is completed and we will release the payment to seller.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => onClose()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmOrderReceivedModal;
