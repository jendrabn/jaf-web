import { Button, Modal } from "react-bootstrap";
import { useConfirmOrderReceived } from "../../../hooks/api/order";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../utils/constans";

interface ConfirmOrderReceivedModalProps {
  orderId: number | null;
  show: boolean;
  onClose: () => void;
}

const ConfirmOrderReceivedModal = (props: ConfirmOrderReceivedModalProps) => {
  const { orderId, show, onClose } = props;

  const queryClient = useQueryClient();
  const { mutate, isPending } = useConfirmOrderReceived();

  const handleConfirm = () => {
    if (!orderId) return;

    mutate(orderId, {
      onSuccess() {
        toast.success("Pesanan berhasil dikonfirmasi.");

        onClose?.();

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDER, orderId],
        });
      },
    });
  };

  return (
    <Modal onHide={() => onClose()} show={show} backdrop="static" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title>Konfirmasi Pesanan Diterima</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">
          Pastikan Anda telah menerima semua barang dalam kondisi baik (tidak
          ada retur/pengembalian) sebelum mengonfirmasi pesanan diterima.
          Setelah Anda konfirmasi, pesanan akan dianggap selesai dan pembayaran
          akan diteruskan ke penjual.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button
          variant="outline-secondary"
          onClick={() => onClose()}
          disabled={isPending}
        >
          Nanti Saja
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={isPending}>
          Konfirmasi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmOrderReceivedModal;
