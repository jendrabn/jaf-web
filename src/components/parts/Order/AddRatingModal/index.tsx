import { Modal, Button, Form } from "react-bootstrap";
import type { OrderTypes } from "@/types/order";
import { useState } from "react";
import { useAddRating } from "@/hooks/api/order";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constans";
import ProductImage from "@/components/parts/ProductImage";
import { toast } from "react-toastify";

interface AddRatingModalProps {
  show: boolean;
  onClose: () => void;
  order: OrderTypes;
}

const AddRatingModal = (props: AddRatingModalProps) => {
  const { show, onClose, order } = props;

  const [ratings, setRatings] = useState(
    order.items.map((item) => ({
      order_item_id: item.id,
      rating: item.rating?.rating || 5,
      comment: item.rating?.comment || "",
      is_anonymous: item.rating?.is_anonymous || false,
    }))
  );

  const { mutate } = useAddRating();
  const queryClient = useQueryClient();

  const handleStarClick = (index: number, starValue: number) => {
    setRatings((prev) =>
      prev.map((r, i) => (i === index ? { ...r, rating: starValue } : r))
    );
  };

  const handleCommentChange = (index: number, value: string) => {
    setRatings((prev) =>
      prev.map((r, i) => (i === index ? { ...r, comment: value } : r))
    );
  };

  const handleAnonymousChange = (index: number, checked: boolean) => {
    setRatings((prev) =>
      prev.map((r, i) => (i === index ? { ...r, is_anonymous: !checked } : r))
    );
  };

  const handleSubmit = () => {
    mutate(ratings, {
      onSuccess() {
        toast.success("Terimakasih telah memberikan penilaian.");

        onClose();

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDERS, order.id],
        });
      },
    });
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Sangat Buruk";
      case 2:
        return "Buruk";
      case 3:
        return "Biasa";
      case 4:
        return "Baik";
      case 5:
        return "Sangat Baik";
      default:
        return "";
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title>Nilai Produk</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order.items.map((item, index) => (
          <div
            key={item.id}
            className={`mb-3 pb-3 ${
              index === order.items.length - 1 ? "" : "border-bottom"
            }`}
          >
            <div className="d-flex align-items-center">
              <ProductImage url={item.product.image} width={60} />
              <div className="ms-3">
                <p className="fs-6 mb-0">{item.product.name}</p>
              </div>
            </div>

            <div className="d-flex align-items-center mt-2">
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(index, star)}
                    style={{
                      cursor: "pointer",
                      color: star <= ratings[index].rating ? "gold" : "gray",
                      fontSize: "32px",
                      marginRight: "5px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ms-3 fs-6">
                {getRatingLabel(ratings[index].rating)}
              </span>
            </div>

            <Form.Group className="mt-2">
              <Form.Label>Komentar</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={ratings[index].comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Check
                type="checkbox"
                label="Tampilkan nama saya pada penilaian"
                checked={!ratings[index].is_anonymous}
                onChange={(e) => handleAnonymousChange(index, e.target.checked)}
              />
            </Form.Group>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button variant="outline-secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {order.items.every((item) => item.rating)
            ? "Perbarui Penilaian"
            : "Kirim Penilaian"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRatingModal;
