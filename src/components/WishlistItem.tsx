import { Button, Form } from "react-bootstrap";
import type { WishlistTypes } from "../types/wishlist";
import { formatPrice } from "../utils/functions";
import ProductImage from "./ProductImage";
import {
  useWishlistDispatch,
  useWishlistState,
} from "../contexts/WishlistContext";
import { useDeleteWishlist } from "../services/api/wishlist";
import { useCreateCart } from "../services/api/cart";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/constans";

interface WishlistItemProps {
  item: WishlistTypes;
}

function WishlistItem({ item: { id, product } }: WishlistItemProps) {
  const { selectedIds } = useWishlistState();
  const dispatch = useWishlistDispatch();
  const queryClient = useQueryClient();
  const deleteWishlistMutation = useDeleteWishlist();
  const createCartMutation = useCreateCart();

  const handleSelect = () => {
    dispatch({
      type: "SELECT",
      payload: id,
    });
  };

  const handleDelete = () => {
    deleteWishlistMutation.mutate(
      { wishlist_ids: [id] },
      {
        onSuccess: () => {
          dispatch({
            type: "DELETE",
            payload: id,
          });
        },
      }
    );
  };

  const handleMoveToCart = () => {
    createCartMutation.mutate(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Berhasil ditambahkan ke keranjang.");

          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARTS] });

          handleDelete();
        },
      }
    );
  };

  return (
    <>
      {/* Mobile Only */}
      <div className="d-flex p-2 mb-2 border shadow-sm d-lg-none">
        <div
          className="d-flex justify-content-center align-items-center me-2"
          style={{ width: "5%" }}
        >
          <Form.Check
            type="checkbox"
            onChange={handleSelect}
            checked={selectedIds.includes(id)}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center me-2">
          <ProductImage url={product.image} alt={product.name} />
        </div>
        <div className="flex-grow-1">
          <p style={{ fontWeight: 500 }} className="mb-1">
            {product.name}
          </p>
          <p className="mb-1 text-gray-700 mb-1">
            {formatPrice(product.price)}
          </p>
          <div className="d-flex g-2 align-items-center justify-content-end">
            <Button
              variant="outline-danger"
              size="sm"
              className="me-2"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleMoveToCart}
            >
              <i className="bi bi-cart-plus"></i>
            </Button>
          </div>
        </div>
      </div>
      {/* End Mobile Only */}

      {/* Desktop Only */}
      <div className="d-flex flex-row align-items-center p-2 mb-2 border shadow-sm d-none d-lg-flex">
        <div className="text-center" style={{ width: "5%" }}>
          <Form.Check
            type="checkbox"
            onChange={handleSelect}
            checked={selectedIds.includes(id)}
          />
        </div>
        <div
          className="d-flex justify-content-start align-items-center"
          style={{ width: "50%" }}
        >
          <ProductImage
            width={60}
            url={product.image}
            alt={product.name}
            className="me-2"
          />
          <span style={{ fontWeight: 500 }}>{product.name}</span>
        </div>
        <div className="text-center" style={{ width: "20%" }}>
          {formatPrice(product.price)}
        </div>

        <div className="text-center" style={{ width: "25%" }}>
          <Button
            variant="outline-danger"
            size="sm"
            className="me-2"
            onClick={handleDelete}
          >
            <i className="bi bi-trash"></i>
          </Button>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMoveToCart}
          >
            <i className="bi bi-cart-plus"></i>
          </Button>
        </div>
      </div>
      {/* End Desktop Only */}
    </>
  );
}

export default WishlistItem;
