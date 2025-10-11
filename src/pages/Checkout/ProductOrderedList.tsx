import { Form, Table } from "react-bootstrap";
import { formatPrice } from "../../utils/functions";
import ProductImage from "../../components/shared/ProductImage";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import { type ChangeEvent } from "react";

interface ProductOrderedListProps {
  className?: string;
}

function ProductOrderedList({ className }: ProductOrderedListProps) {
  const state = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const carts = state.checkout?.carts || [];
  const shippingCosts = state.shippingCosts || [];

  const handleShippingChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedShipping = shippingCosts[parseInt(e.target.value)];

    if (selectedShipping) {
      dispatch({ type: "SET_SHIPPING", payload: selectedShipping });
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h5 className="card-title mb-3">Produk Dipesan</h5>

        {carts && carts.length > 0 && (
          <Table responsive className="align-middle">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Produk</th>
                <th>Kuantitas</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => {
                const { product, quantity } = cart;
                const {
                  price,
                  price_after_discount,
                  is_discounted,
                  discount_in_percent,
                } = product;

                const isDiscounted = Boolean(
                  is_discounted && price_after_discount != null
                );
                const unitPrice = isDiscounted
                  ? price_after_discount ?? price
                  : price;
                const subtotal = unitPrice * quantity;
                const originalSubtotal = price * quantity;

                const discountPercent =
                  typeof discount_in_percent === "number"
                    ? Math.max(Math.round(discount_in_percent), 0)
                    : price > 0 && price_after_discount != null
                    ? Math.max(
                        Math.round(
                          ((price - price_after_discount) / price) * 100
                        ),
                        0
                      )
                    : null;

                const discountLabel =
                  discountPercent && discountPercent > 0
                    ? `-${discountPercent}%`
                    : null;

                return (
                  <tr key={cart.id}>
                    <td>
                      <ProductImage
                        className="me-2"
                        url={product.image}
                        alt={product.name}
                      />
                      {product.name}
                    </td>
                    <td className="text-center">
                      {isDiscounted ? (
                        <div className="d-flex flex-column align-items-center">
                          <span>{formatPrice(unitPrice)}</span>
                          <small className="text-gray-600">
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatPrice(price)}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </small>
                        </div>
                      ) : (
                        formatPrice(unitPrice)
                      )}
                    </td>
                    <td className="text-center">{quantity}</td>
                    <td className="text-end">
                      {isDiscounted ? (
                        <div className="d-flex flex-column align-items-end">
                          <span>{formatPrice(subtotal)}</span>
                          <small className="text-gray-600">
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatPrice(originalSubtotal)}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </small>
                        </div>
                      ) : (
                        formatPrice(subtotal)
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* <tr>
                <td colSpan={3}></td>
                <td>
                  <strong className="float-end">
                    {formatPrice(
                      carts.reduce(
                        (acc, cart) => acc + cart.product.price * cart.quantity,
                        0
                      )
                    )}
                  </strong>
                </td>
              </tr> */}
            </tbody>
          </Table>
        )}

        <Form.Group>
          <Form.Label className="fw-bold">Opsi Pengiriman</Form.Label>

          <Form.Select
            onChange={handleShippingChange}
            disabled={state.isLoadingShippingCosts}
          >
            <option>Pilih Opsi Pengiriman</option>
            {shippingCosts.map((cost, index) => (
              <option key={`shipping-${index}`} value={index}>
                {`${cost.courier_name} - ${cost.service_name} - ${formatPrice(
                  cost.cost
                )}`}
              </option>
            ))}
          </Form.Select>
          {state.isLoadingShippingCosts && (
            <Form.Text className="text-muted">
              Sedang memuat opsi pengiriman
            </Form.Text>
          )}
        </Form.Group>
      </div>
    </div>
  );
}

export default ProductOrderedList;
