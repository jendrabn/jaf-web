import { Button, Form } from "react-bootstrap";
import type { CartItemTypes } from "../types/cart";
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

  const { price, price_after_discount, discount_in_percent, is_discounted } =
    product;

  const isDiscounted = Boolean(is_discounted && price_after_discount != null);
  const unitPrice = isDiscounted ? price_after_discount ?? price : price;
  const subtotal = unitPrice * quantity;
  const originalSubtotal = price * quantity;
  const discountPercent =
    typeof discount_in_percent === "number"
      ? Math.max(Math.round(discount_in_percent), 0)
      : price > 0 && price_after_discount != null
      ? Math.max(
          Math.round(((price - price_after_discount) / price) * 100),
          0
        )
      : null;
  const discountLabel =
    discountPercent && discountPercent > 0 ? `-${discountPercent}%` : null;

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
      {/* Desktop */}
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
          {isDiscounted ? (
            <div className="d-flex flex-column align-items-center">
              <span>{formatPrice(unitPrice)}</span>
              <small className="text-gray-600">
                (
                <span className="text-decoration-line-through text-muted">
                  {formatPrice(price)}
                </span>
                {discountLabel && <span className="ms-1">{discountLabel}</span>}
                )
              </small>
            </div>
          ) : (
            formatPrice(price)
          )}
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
          {isDiscounted ? (
            <div className="d-flex flex-column align-items-center">
              <span>{formatPrice(subtotal)}</span>
              <small className="text-gray-600">
                (
                <span className="text-decoration-line-through text-muted">
                  {formatPrice(originalSubtotal)}
                </span>
                {discountLabel && <span className="ms-1">{discountLabel}</span>}
                )
              </small>
            </div>
          ) : (
            formatPrice(subtotal)
          )}
        </div>

        <div style={{ width: "10%" }} className="text-center my-auto">
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="d-flex p-2 mb-2 shadow-sm border d-lg-none">
        <div className="d-flex justify-content-center align-items-center me-2">
          <Form.Check
            type="checkbox"
            checked={selectedIds.includes(id)}
            onChange={handleSelect}
          />
        </div>

        <div className="d-flex align-items-center me-2">
          <ProductImage
            url={product.image}
            alt={product.name}
            width={60}
            className="border"
          />
        </div>

        <div className="flex-grow-1">
          <p className="mb-1 title-truncate" style={{ fontWeight: 500 }}>
            {product.name}
          </p>
          <p className="mb-1 text-gray-700">
            {isDiscounted ? (
              <>
                <span className="text-danger me-2">{formatPrice(unitPrice)}</span>
                <small className="text-gray-600">
                  (
                  <span className="text-decoration-line-through text-muted">
                    {formatPrice(price)}
                  </span>
                  {discountLabel && <span className="ms-1">{discountLabel}</span>}
                  )
                </small>
              </>
            ) : (
              formatPrice(price)
            )}
          </p>
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
            {isDiscounted ? (
              <>
                <span>{formatPrice(subtotal)}</span>
                <small className="text-gray-600 ms-2">
                  (
                  <span className="text-decoration-line-through text-muted">
                    {formatPrice(originalSubtotal)}
                  </span>
                  {discountLabel && <span className="ms-1">{discountLabel}</span>}
                  )
                </small>
              </>
            ) : (
              formatPrice(subtotal)
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default CartItem;
