import { Form, Table } from "react-bootstrap";
import Select, { type SingleValue } from "react-select";
import { formatCurrency } from "@/utils/format";
import ProductImage from "@/components/parts/ProductImage";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "@/contexts/CheckoutContext";
import { getProductPricingInfo } from "@/utils/pricing";

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
                const pricing = getProductPricingInfo(product);
                const unitPrice = pricing.currentPrice ?? product.price;
                const subtotal = unitPrice * quantity;
                const originalSubtotal =
                  (pricing.strikeThroughPrice ?? product.price) * quantity;
                const showStrikeThrough =
                  Boolean(pricing.strikeThroughPrice) &&
                  pricing.strikeThroughPrice !== unitPrice;

                const discountLabel =
                  pricing.discountPercent && pricing.discountPercent > 0
                    ? `-${pricing.discountPercent}%`
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
                      {showStrikeThrough ? (
                        <div className="d-flex flex-column align-items-center">
                          <span>{formatCurrency(unitPrice)}</span>
                          <small className="text-secondary-emphasis">
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatCurrency(
                                pricing.strikeThroughPrice ?? product.price
                              )}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </small>
                        </div>
                      ) : (
                        formatCurrency(unitPrice)
                      )}
                    </td>
                    <td className="text-center">{quantity}</td>
                    <td className="text-end">
                      {showStrikeThrough ? (
                        <div className="d-flex flex-column align-items-end">
                          <span>{formatCurrency(subtotal)}</span>
                          <small className="text-secondary-emphasis">
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatCurrency(originalSubtotal)}
                            </span>
                            {discountLabel && (
                              <span className="ms-1">{discountLabel}</span>
                            )}
                            )
                          </small>
                        </div>
                      ) : (
                        formatCurrency(subtotal)
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* <tr>
                <td colSpan={3}></td>
                <td>
                  <strong className="float-end">
                    {formatCurrency(
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
              } - ${formatCurrency(cost.cost)}`,
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
                    } - ${formatCurrency(shippingCosts[idx].cost)}`,
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
