import { Form } from "react-bootstrap";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "@/contexts/CheckoutContext";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_EWALLET,
  PAYMENT_METHOD_GATEWAY,
} from "@/utils/constans";
import type { ChangeEvent } from "react";
import { formatCurrency } from "@/utils/functions";

interface PaymentMethodProps {
  className?: string;
}

function PaymentMethod({ className }: PaymentMethodProps) {
  const { paymentMethod, checkout, bank, ewallet } = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const banks = checkout?.payment_methods?.bank;
  const ewallets = checkout?.payment_methods?.ewallet;
  const gateway = checkout?.payment_methods?.gateway;
  const gatewayRadioId = "payment-method-gateway";
  const bankRadioId = "payment-method-bank";
  const ewalletRadioId = "payment-method-ewallet";

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ type: "SET_PAYMENT_METHOD", payload: value });

    // Reset selections to avoid unintended states and fees
    if (value === PAYMENT_METHOD_GATEWAY) {
      if (bank) dispatch({ type: "SET_BANK", payload: null });
      if (ewallet) dispatch({ type: "SET_EWALLET", payload: null });
    } else if (value === PAYMENT_METHOD_BANK) {
      if (ewallet) dispatch({ type: "SET_EWALLET", payload: null });
    } else if (value === PAYMENT_METHOD_EWALLET) {
      if (bank) dispatch({ type: "SET_BANK", payload: null });
    }
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
        <h5 className="card-title mb-3">Pembayaran</h5>

        <div>
          <Form.Group className="mb-3" controlId="payment">
            <Form.Label className="fw-bold">Metode Pembayaran</Form.Label>
            <div>
              {gateway && (
                <Form.Check
                  inline
                  type="radio"
                  id={gatewayRadioId}
                  label="Midtrans (Otomatis)"
                  name="payment_method"
                  value={PAYMENT_METHOD_GATEWAY}
                  checked={paymentMethod === PAYMENT_METHOD_GATEWAY}
                  onChange={handlePaymentMethodChange}
                />
              )}

              <Form.Check
                inline
                type="radio"
                id={bankRadioId}
                label="Bank (Manual)"
                name="payment_method"
                value={PAYMENT_METHOD_BANK}
                checked={paymentMethod === PAYMENT_METHOD_BANK}
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                inline
                type="radio"
                id={ewalletRadioId}
                label="E-Wallet (Manual)"
                name="payment_method"
                value={PAYMENT_METHOD_EWALLET}
                checked={paymentMethod === PAYMENT_METHOD_EWALLET}
                onChange={handlePaymentMethodChange}
              />
            </div>
          </Form.Group>

          {paymentMethod === PAYMENT_METHOD_GATEWAY && gateway && (
            <div className="alert alert-info small">
              <div>Provider: {gateway.provider}</div>
              <div>Biaya Payment Gateway: {formatCurrency(gateway.fee)}</div>
            </div>
          )}

          {paymentMethod === PAYMENT_METHOD_BANK && (
            <Form.Group className="mb-3" controlId="bank">
              <Form.Label className="fw-bold">Bank</Form.Label>
              <Form.Select value={bank?.id} onChange={handlePaymentBankChange}>
                <option>Pilih Bank</option>
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
              <Form.Label className="fw-bold">E-Wallet</Form.Label>
              <Form.Select
                value={ewallet?.id}
                onChange={handlePaymentEwalletChange}
              >
                <option>Pilih E-Wallet</option>
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
