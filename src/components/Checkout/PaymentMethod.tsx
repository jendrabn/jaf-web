import { Form } from "react-bootstrap";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_EWALLET,
} from "../../utils/constans";
import type { ChangeEvent } from "react";

interface PaymentMethodProps {
  className?: string;
}

function PaymentMethod({ className }: PaymentMethodProps) {
  const { paymentMethod, checkout, bank, ewallet } = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const banks = checkout?.payment_methods?.bank;
  const ewallets = checkout?.payment_methods?.ewallet;

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: e.target.value });
  };

  const handlePaymentBankChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const bankId = parseInt(e.target.value);
    const selectedBank = banks?.find((bank) => bank.id === bankId);

    if (selectedBank) {
      dispatch({ type: "SET_BANK", payload: selectedBank });
    }
  };

  const handlePaymentEwalletChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const ewalletId = parseInt(e.target.value);
    const selectedEwallet = ewallets?.find(
      (ewallet) => ewallet.id === ewalletId
    );

    if (selectedEwallet) {
      dispatch({ type: "SET_EWALLET", payload: selectedEwallet });
    }
  };

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
                value={PAYMENT_METHOD_BANK}
                checked={paymentMethod === PAYMENT_METHOD_BANK}
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                inline
                type="radio"
                label="E-Wallet"
                name="payment_method"
                value={PAYMENT_METHOD_EWALLET}
                checked={paymentMethod === PAYMENT_METHOD_EWALLET}
                onChange={handlePaymentMethodChange}
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

          {paymentMethod === PAYMENT_METHOD_BANK && (
            <Form.Group className="mb-3" controlId="bank">
              <Form.Label className="fw-bold">Bank Option</Form.Label>
              <Form.Select value={bank?.id} onChange={handlePaymentBankChange}>
                <option>Choose Bank</option>
                {banks?.map((bank) => (
                  <option value={bank.id} key={`bank-${bank.id}`}>
                    {`${bank.name} - ${bank.account_number} - a.n ${bank.account_name}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {paymentMethod === PAYMENT_METHOD_EWALLET && (
            <Form.Group className="mb-3" controlId="ewallet">
              <Form.Label className="fw-bold">E-Wallet Option</Form.Label>
              <Form.Select
                value={ewallet?.id}
                onChange={handlePaymentEwalletChange}
              >
                <option>Choose E-Wallet</option>
                {ewallets?.map((ewallet) => (
                  <option value={ewallet.id} key={`ewallet-${ewallet.id}`}>
                    {`${ewallet.name} - ${ewallet.phone} - a.n ${ewallet.account_username}`}
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
