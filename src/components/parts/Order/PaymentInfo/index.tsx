import { Table } from "react-bootstrap";
import { formatCurrency } from "@/utils/functions";
import { type OrderDetailTypes } from "@/types/order";
import { PAYMENT_METHOD_BANK, PAYMENT_METHOD_EWALLET } from "@/utils/constans";
import { useEffect, useState } from "react";
import CopyTextButton from "@/components/ui/CopyTextButton";

interface PaymentInfoProps {
  paymentDueDate: string;
  payment: OrderDetailTypes["payment"];
}

// count down payment due date
const countDown = (paymentDueDate: string) => {
  const now = new Date().getTime();
  const due = new Date(paymentDueDate).getTime();
  const distance = due - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

const PaymentInfo = ({ paymentDueDate, payment }: PaymentInfoProps) => {
  // state count down
  const [countDownPaymentDueDate, setCountDownPaymentDueDate] = useState(
    countDown(paymentDueDate)
  );

  // update countdown every second
  useEffect(() => {
    const id = setInterval(() => {
      setCountDownPaymentDueDate(countDown(paymentDueDate));
    }, 1000);
    return () => clearInterval(id);
  }, [paymentDueDate]);

  return (
    <>
      <div className="mb-4">
        <p className="text-muted text-center">Selesaikan pembayaran dalam</p>
        <p className="mb-0 text-center h4 fw-bold">
          {countDownPaymentDueDate.hours} jam :{" "}
          {countDownPaymentDueDate.minutes} menit :{" "}
          {countDownPaymentDueDate.seconds} detik
        </p>
      </div>

      {payment.method === PAYMENT_METHOD_BANK && (
        <Table size="sm" className="align-middle mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted">Bank</td>
              <td className="text-end">{payment?.info?.name}</td>
            </tr>
            <tr>
              <td className="text-muted">Kode Bank</td>
              <td className="text-end">{payment?.info?.code}</td>
            </tr>
            <tr>
              <td className="text-muted">Nama Rekening</td>
              <td className="text-end">{payment?.info?.account_name}</td>
            </tr>
            <tr>
              <td className="text-muted">Nomor Rekening</td>
              <td className="text-end">
                <CopyTextButton
                  text={payment?.info?.account_number || ""}
                  withLabel={false}
                />
                {payment?.info?.account_number}
              </td>
            </tr>
            <tr>
              <td className="text-muted">Total Pembayaran</td>
              <td className="text-end fw-bold">
                <CopyTextButton
                  text={payment.amount?.toString() || ""}
                  withLabel={false}
                />
                {formatCurrency(payment.amount || 0)}
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
              <td className="text-muted">Nama Akun</td>
              <td className="text-end">{payment?.info?.account_name}</td>
            </tr>
            <tr>
              <td className="text-muted">Username Akun</td>
              <td className="text-end">{payment?.info?.account_username}</td>
            </tr>
            <tr>
              <td className="text-muted">Nomor HP</td>
              <td className="text-end">
                <CopyTextButton
                  text={payment?.info?.phone || ""}
                  withLabel={false}
                />
                {payment?.info?.phone}
              </td>
            </tr>
            <tr>
              <td className="text-muted">Total Pembayaran</td>
              <td className="text-end fw-bold">
                <CopyTextButton
                  text={payment.amount?.toString() || ""}
                  withLabel={false}
                />{" "}
                {formatCurrency(payment.amount || 0)}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </>
  );
};

export default PaymentInfo;
