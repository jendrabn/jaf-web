import { Button, Form } from "react-bootstrap";
import type { CartItemTypes } from "@/types/cart";
import { formatCurrency } from "@/utils/format";
import ProductImage from "@/components/parts/ProductImage";
import QuantityInput from "@/components/ui/QuantityInput";
import { useUpdateCart, useDeleteCart } from "@/hooks/api/cart";
import { useCartDispatch, useCartState } from "@/contexts/CartContext";
import { getProductPricingInfo } from "@/utils/pricing";

interface CartItemProps {
  cart: CartItemTypes;
}

function CartItem({ cart }: CartItemProps) {
  const { selectedIds } = useCartState();
  const dispatch = useCartDispatch();
  const updateCartMutation = useUpdateCart();
  const deleteCartMutation = useDeleteCart();

  const { id, product, quantity } = cart;

  const pricing = getProductPricingInfo(product);
  const unitPrice = pricing.currentPrice ?? product.price;
  const subtotal = unitPrice * quantity;
  const originalSubtotal = (pricing.strikeThroughPrice ?? product.price) * quantity;
  const showStrikeThrough =
    Boolean(pricing.strikeThroughPrice) &&
    pricing.strikeThroughPrice !== unitPrice;
  const discountLabel =
    pricing.discountPercent && pricing.discountPercent > 0
      ? `-${pricing.discountPercent}%`
      : null;

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
          {showStrikeThrough ? (
            <div className="d-flex flex-column align-items-center">
              <span>{formatCurrency(unitPrice)}</span>
              <small className="text-gray-600">
                (
                <span className="text-decoration-line-through text-muted">
                  {formatCurrency(pricing.strikeThroughPrice ?? product.price)}
                </span>
                {discountLabel && <span className="ms-1">{discountLabel}</span>}
                )
              </small>
            </div>
          ) : (
            formatCurrency(unitPrice)
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
          {showStrikeThrough ? (
            <div className="d-flex flex-column align-items-center">
              <span>{formatCurrency(subtotal)}</span>
              <small className="text-gray-600">
                (
                <span className="text-decoration-line-through text-muted">
                  {formatCurrency(originalSubtotal)}
                </span>
                {discountLabel && <span className="ms-1">{discountLabel}</span>}
                )
              </small>
            </div>
          ) : (
            formatCurrency(subtotal)
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
          <p className="mb-1 line-clamp-2" style={{ fontWeight: 500 }}>
            {product.name}
          </p>
          <p className="mb-1 text-gray-700">
            {showStrikeThrough ? (
              <>
                <span className="text-danger me-2">
                  {formatCurrency(unitPrice)}
                </span>
                <small className="text-gray-600">
                  (
                  <span className="text-decoration-line-through text-muted">
                    {formatCurrency(pricing.strikeThroughPrice ?? product.price)}
                  </span>
                  {discountLabel && (
                    <span className="ms-1">{discountLabel}</span>
                  )}
                  )
                </small>
              </>
            ) : (
              formatCurrency(unitPrice)
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
            {showStrikeThrough ? (
              <>
                <span>{formatCurrency(subtotal)}</span>
                <small className="text-gray-600 ms-2">
                  (
                  <span className="text-decoration-line-through text-muted">
                    {formatCurrency(originalSubtotal)}
                  </span>
                  {discountLabel && (
                    <span className="ms-1">{discountLabel}</span>
                  )}
                  )
                </small>
              </>
            ) : (
              formatCurrency(subtotal)
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default CartItem;
