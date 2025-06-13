import { Form, Table } from "react-bootstrap";
import { formatPrice } from "../../utils/functions";
import ProductImage from "../ProductImage";
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
        <h5 className="card-title mb-3">Products Ordered</h5>

        {carts && carts.length > 0 && (
          <Table responsive className="align-middle">
            <thead>
              <tr className="text-center">
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id}>
                  <td>
                    <ProductImage
                      className="me-2"
                      url={cart.product.image}
                      alt={cart.product.name}
                    />
                    {cart.product.name}
                  </td>
                  <td>{formatPrice(cart.product.price)}</td>
                  <td className="text-center">{cart.quantity}</td>
                  <td className="text-end">
                    {formatPrice(cart.product.price * cart.quantity)}
                  </td>
                </tr>
              ))}
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
          <Form.Label className="fw-bold">Shipping Option</Form.Label>

          <Form.Select
            onChange={handleShippingChange}
            disabled={state.isLoadingShippingCosts}
          >
            <option>Choose Shipping Service</option>
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
              Please wait a moment to get shipping costs ...
            </Form.Text>
          )}
        </Form.Group>
      </div>
    </div>
  );
}

export default ProductOrderedList;
