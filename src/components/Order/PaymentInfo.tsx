import { Alert, Table } from "react-bootstrap";
import { formatDateTime, formatPrice } from "../../utils/functions";
import { type OrderDetailTypes } from "../../types/order";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_EWALLET,
} from "../../utils/constans";

interface PaymentInfoProps {
  paymentDueDate: string;
  payment: OrderDetailTypes["payment"];
}

function PaymentInfo({ paymentDueDate, payment }: PaymentInfoProps) {
  return (
    <div className="p-3 border mb-4">
      <h4 className="text-center mb-3">
        <i className="bi bi-cash-coin me-1"></i> Payment Info
      </h4>

      <Alert variant="danger" className="p-2 mb-3">
        <p className="mb-0 text-center">
          <b>Notice:</b> Please complete the payment of{" "}
          <b>{formatPrice(payment.amount)}</b> to the account below before{" "}
          <b>{formatDateTime(paymentDueDate)}</b>
        </p>
      </Alert>

      {payment.method === PAYMENT_METHOD_BANK && (
        <Table size="sm" className="align-middle mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted">Bank</td>
              <td className="text-end">{payment?.info?.name}</td>
            </tr>
            <tr>
              <td className="text-muted">Bank Code</td>
              <td className="text-end">{payment?.info?.code}</td>
            </tr>
            <tr>
              <td className="text-muted">Account Name</td>
              <td className="text-end">{payment?.info?.account_name}</td>
            </tr>
            <tr>
              <td className="text-muted">Account Number</td>
              <td className="text-end">{payment?.info?.account_number}</td>
            </tr>
            <tr>
              <td className="text-muted">Total Payment</td>
              <td className="text-end fw-bold">
                {formatPrice(payment.amount || 0)}
              </td>
            </tr>
          </tbody>
        </Table>
      )}

      {payment.method === PAYMENT_METHOD_EWALLET && (
        <Table size="sm" className="align-middle mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted">E-Wallet</td>
              <td className="text-end">{payment?.info?.name}</td>
            </tr>
            <tr>
              <td className="text-muted">Account Name</td>
              <td className="text-end">{payment?.info?.account_name}</td>
            </tr>
            <tr>
              <td className="text-muted">Account Username</td>
              <td className="text-end">{payment?.info?.account_username}</td>
            </tr>
            <tr>
              <td className="text-muted">Phone Number</td>
              <td className="text-end">{payment?.info?.phone}</td>
            </tr>
            <tr>
              <td className="text-muted">Total Payment</td>
              <td className="text-end fw-bold">
                {formatPrice(payment.amount || 0)}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default PaymentInfo;
