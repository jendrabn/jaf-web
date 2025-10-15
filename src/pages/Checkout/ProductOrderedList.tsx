import { Form, Table } from "react-bootstrap";
import Select, { type SingleValue } from "react-select";
import { formatPrice } from "../../utils/functions";
import ProductImage from "../../components/shared/ProductImage";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";

interface ProductOrderedListProps {
  className?: string;
}

function ProductOrderedList({ className }: ProductOrderedListProps) {
  const state = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const carts = state.checkout?.carts || [];
  const shippingCosts = state.shippingCosts || [];

  type Option = { value: number; label: string };

  const handleShippingChange = (option: SingleValue<Option>) => {
    if (!option) return;

    const idx = option.value;
    const selectedShipping = shippingCosts[idx];

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
                          <small className="text-secondary-emphasis">
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
                          <small className="text-secondary-emphasis">
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

          <Select
            inputId="shipping-select"
            classNamePrefix="react-select"
            placeholder="Pilih Opsi Pengiriman..."
            isSearchable
            isLoading={state.isLoadingShippingCosts}
            isDisabled={
              state.isLoadingShippingCosts || shippingCosts.length === 0
            }
            options={shippingCosts.map((cost, index) => ({
              value: index,
              label: `${cost.courier_name} - ${
                cost.service_name
              } - ${formatPrice(cost.cost)}`,
            }))}
            onChange={handleShippingChange}
            value={(() => {
              const idx = shippingCosts.findIndex((c) =>
                state.shipping
                  ? c.courier_name === state.shipping.courier_name &&
                    c.service_name === state.shipping.service_name &&
                    c.cost === state.shipping.cost
                  : false
              );

              return idx >= 0
                ? {
                    value: idx,
                    label: `${shippingCosts[idx].courier_name} - ${
                      shippingCosts[idx].service_name
                    } - ${formatPrice(shippingCosts[idx].cost)}`,
                  }
                : null;
            })()}
          />

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
