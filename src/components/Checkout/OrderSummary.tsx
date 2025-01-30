import { Form, Table } from "react-bootstrap";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import { formatPrice } from "../../utils/functions";

function OrderSummary() {
  const { checkout, shipping, note } = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_NOTE", payload: e.target.value });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title mb-3">Order Summary</h5>
        <Table responsive>
          <tbody>
            <tr>
              <td className="text-gray-700">
                Total Price ({checkout?.total_quantity})
              </td>
              <td className="text-end">
                {formatPrice(checkout?.total_price || 0)}
              </td>
            </tr>
            <tr>
              <td className="text-gray-700">
                Shipping Cost ({Math.round(checkout?.total_weight || 0 / 1000)}
                kg)
              </td>
              <td className="text-end">{formatPrice(shipping?.cost || 0)}</td>
            </tr>
            <tr>
              <td className="text-gray-700">Tax</td>
              <td className="text-end">{formatPrice(0)}</td>
            </tr>
            <tr>
              <td className="text-gray-700">Total Amount</td>
              <td className="text-end">
                {formatPrice(
                  (checkout?.total_price || 0) + (shipping?.cost || 0)
                )}
              </td>
            </tr>
          </tbody>
        </Table>

        <Form.Group>
          <Form.Control
            value={note}
            placeholder="Please leave a message for seller..."
            onChange={handleNoteChange}
          />
        </Form.Group>
      </div>
    </div>
  );
}

export default OrderSummary;
