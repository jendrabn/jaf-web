import { Form } from "react-bootstrap";
import { BankTypes } from "../../types/payment-method";

interface PaymentMethodProps {
  className?: string;
  onChangePaymentMethod: (method: string) => void;
  onChangePaymentBank: (bank: BankTypes) => void;
  paymentMethod?: string;
  paymentBanks: BankTypes[];
  paymentEWallets?: unknown[];
  bankId?: number;
  ewalletId?: number;
}

function PaymentMethod({
  className,
  onChangePaymentMethod,
  onChangePaymentBank,
  paymentMethod,
  paymentBanks,
  bankId,
}: //   ewalletId,
PaymentMethodProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h5 className="card-title mb-3">Payment</h5>

        <div>
          <Form.Group className="mb-3" controlId="payment">
            <Form.Label className="fw-bold">Payment Method</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Bank Transfer"
                name="payment_method"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => onChangePaymentMethod?.(e.target.value)}
              />
              <Form.Check
                inline
                type="radio"
                label="EWallet"
                name="payment_method"
                value="ewallet"
                disabled
              />

              <Form.Check
                inline
                type="radio"
                label="Cash On Delivery (COD)"
                name="payment_method"
                value="cod"
                disabled
              />
            </div>
          </Form.Group>

          {paymentMethod === "bank" && (
            <Form.Group className="mb-3" controlId="bank">
              <Form.Label className="fw-bold">Bank Option</Form.Label>
              <Form.Select
                value={bankId}
                onChange={(e) => {
                  const bank = paymentBanks?.find(
                    (bank) => bank.id === +e.target.value!
                  );

                  if (bank) {
                    onChangePaymentBank?.(bank);
                  }
                }}
              >
                <option>Choose Bank</option>
                {paymentBanks?.map((bank) => (
                  <option value={bank.id} key={`bank-${bank.id}`}>
                    {`${bank.name} - ${bank.account_number} - a.n ${bank.account_name}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
