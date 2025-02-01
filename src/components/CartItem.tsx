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
    <>
      {/* Mobile */}
      <div className="d-flex p-2 mb-2 shadow-sm border d-none d-lg-flex">
        <div
          style={{ width: "5%" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Form.Check
            type="checkbox"
            checked={selectedIds.includes(id)}
            onChange={handleSelect}
          />
        </div>

        <div style={{ width: "40%" }} className="d-flex align-items-center">
          <ProductImage
            url={product.image}
            alt={product.name}
            className="me-2"
          />
          <span>{product.name}</span>
        </div>

        <div style={{ width: "15%" }} className="text-center my-auto">
          {formatPrice(product.price)}
        </div>

        <div style={{ width: "15%" }} className="text-center my-auto">
          <QuantityInput
            onChange={(quantity) => handleUpdate(quantity)}
            maxValue={product.stock}
            initialValue={quantity}
            size="sm"
            disabled={updateCartMutation.isPending}
          />
        </div>

        <div style={{ width: "15%" }} className="text-center my-auto">
          {formatPrice(product.price * quantity)}
        </div>

        <div style={{ width: "10%" }} className="text-center my-auto">
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="d-flex p-2 mb-2 shadow-sm border d-lg-none">
        <div className="d-flex justify-content-center align-items-center me-2">
          <Form.Check
            type="checkbox"
            checked={selectedIds.includes(id)}
            onChange={handleSelect}
          />
        </div>

        <div className="d-flex align-items-center me-2">
          <ProductImage url={product.image} alt={product.name} />
        </div>

        <div className="flex-grow-1">
          <p className="mb-1" style={{ fontWeight: 500 }}>
            {product.name}
          </p>
          <p className="mb-1 text-gray-700">{formatPrice(product.price)}</p>
          <div className="d-flex justify-content-between mb-2">
            <div className="flex-grow-1">
              <QuantityInput
                onChange={(quantity) => handleUpdate(quantity)}
                maxValue={product.stock}
                initialValue={quantity}
                size="sm"
                disabled={updateCartMutation.isPending}
              />
            </div>
            <div className="text-end">
              <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </div>
          <p className="mb-0 text-end fw-bold">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>
    </>
  );
}

export default CartItem;
