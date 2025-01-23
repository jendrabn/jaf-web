import { Form, Table } from "react-bootstrap";
import { CartItemTypes } from "../../types/cart";
import { formatToRupiah } from "../../utils/functions";
import { ShippingCostTypes } from "../../types/checkout";
import { OrderReqTypes } from "../../types/order";
import ProductImage from "../ProductImage";

interface ProductOrderedListProps {
  className?: string;
  carts: CartItemTypes[];
  shippingCosts: ShippingCostTypes[];
  notes: OrderReqTypes["notes"];
  onChangeShipping: (shipping: ShippingCostTypes) => void;
  onChangeNotes: (notes: OrderReqTypes["notes"]) => void;
}

function ProductOrderedList({
  carts,
  shippingCosts,
  onChangeShipping,
  className,
}: ProductOrderedListProps) {
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
                  <td>{formatToRupiah(cart.product.price)}</td>
                  <td className="text-center">{cart.quantity}</td>
                  <td className="text-end">
                    {formatToRupiah(cart.product.price * cart.quantity)}
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td colSpan={3}></td>
                <td>
                  <strong className="float-end">
                    {formatToRupiah(
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
            onChange={(e) => {
              const shipping = shippingCosts[Number(e.target.value)];

              if (shipping) {
                onChangeShipping(shipping);
              }
            }}
          >
            <option>Choose Shipping Service</option>
            {shippingCosts.map((cost, index) => (
              <option key={`shipping-${index}`} value={index}>
                {`${cost.courier_name} - ${
                  cost.service_name
                } - ${formatToRupiah(cost.cost)}`}
              </option>
            ))}
          </Form.Select>
          <Form.Text>
            {shippingCosts.length === 0 && "Please wait a moment..."}
          </Form.Text>
        </Form.Group>
      </div>
    </div>
  );
}

export default ProductOrderedList;
