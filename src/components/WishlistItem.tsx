import { Button, Form } from "react-bootstrap";
import { WishlistTypes } from "../types/wishlist";
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
          toast.success("Item has been moved to your shopping cart.");

          queryClient.invalidateQueries({ queryKey: ["carts"] });

          handleDelete();
        },
      }
    );
  };

  return (
    <tr>
      <td className="text-center">
        <Form.Check
          type="checkbox"
          onChange={handleSelect}
          checked={selectedIds.includes(id)}
        />
      </td>
      <td>
        <ProductImage url={product.image} alt={product.name} className="me-2" />
        <span>{product.name}</span>
      </td>
      <td className="text-center">{formatPrice(product.price)}</td>
      <td className="text-center">
        <Button
          variant="outline-danger"
          size="sm"
          className="me-2"
          onClick={handleDelete}
        >
          <i className="bi bi-trash"></i>
        </Button>

        <Button variant="outline-primary" size="sm" onClick={handleMoveToCart}>
          <i className="bi bi-cart-plus"></i>
        </Button>
      </td>
    </tr>
  );
}

export default WishlistItem;
