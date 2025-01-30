import { Button, Form } from "react-bootstrap";
import { CartItemTypes } from "../types/cart";
import { formatPrice } from "../utils/functions";
import ProductImage from "./ProductImage";
import QuantityInput from "./QuantityInput";
import { useUpdateCart, useDeleteCart } from "../services/api/cart";
import { useCartDispatch, useCartState } from "../contexts/CartContext";

interface CartItemProps {
  cart: CartItemTypes;
}

function CartItem({ cart }: CartItemProps) {
  const { selectedIds } = useCartState();
  const dispatch = useCartDispatch();
  const updateCartMutation = useUpdateCart();
  const deleteCartMutation = useDeleteCart();

  const { id, product, quantity } = cart;

  const handleSelect = () => {
    dispatch({ type: "SELECT", payload: id });
  };

  const handleDelete = () => {
    deleteCartMutation.mutate(
      { cart_ids: [id] },
      {
        onSuccess() {
          dispatch({ type: "DELETE", payload: id });
        },
      }
    );
  };

  const handleUpdate = (quantity: number) => {
    updateCartMutation.mutate(
      {
        id,
        data: { quantity },
      },
      {
        onSuccess() {
          dispatch({ type: "UPDATE", payload: { id, quantity } });
        },
      }
    );
  };

  return (
    <tr>
      <td className="text-center">
        <Form.Check
          type="checkbox"
          checked={selectedIds.includes(id)}
          onChange={handleSelect}
        />
      </td>
      <td>
        <ProductImage url={product.image} alt={product.name} className="me-2" />
        {product.name}
      </td>
      <td className="text-center">{formatPrice(product.price)}</td>
      <td className="text-center">
        <QuantityInput
          onChange={(quantity) => handleUpdate(quantity)}
          maxValue={product.stock}
          initialValue={quantity}
          size="sm"
          disabled={updateCartMutation.isPending}
        />
      </td>
      <td className="text-center">{formatPrice(product.price * quantity)}</td>
      <td className="text-center">
        <Button
          variant="outline-danger"
          size="sm"
          disabled={deleteCartMutation.isPending}
          onClick={handleDelete}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </td>
    </tr>
  );
}

export default CartItem;
