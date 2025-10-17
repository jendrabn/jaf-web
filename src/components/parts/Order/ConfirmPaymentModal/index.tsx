import { Button, Card, Form, Modal } from "react-bootstrap";
import Select, { type SingleValue } from "react-select";
import { useConfirmPayment, useFetchOrder } from "@/hooks/api/order";
import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorValidationAlert from "@/components/ui/ErrorValidationAlert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import bankList from "@/data/bank-list.json";
import { useLocation, useNavigate } from "react-router";
import Loading from "@/components/ui/Loading";
import {
  PAYMENT_METHOD_BANK,
  PAYMENT_METHOD_EWALLET,
  QUERY_KEYS,
} from "@/utils/constans";
import type { ConfirmPaymentReqTypes } from "@/types/order";
import { useForm, type SubmitHandler } from "react-hook-form";
import PaymentInfo from "@/components/parts/Order/PaymentInfo";

interface ConfirmPaymentModalProps {
  show: boolean;
  orderId: number | null;
  onClose: () => void;
}

const ConfirmPaymentModal = (props: ConfirmPaymentModalProps) => {
  const { show, orderId, onClose } = props;

  const queryClient = useQueryClient();
  const { data: order, isLoading } = useFetchOrder(orderId!);

  const {
    mutate,
    error,
    reset: resetMutation,
    isPending,
  } = useConfirmPayment();

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<ConfirmPaymentReqTypes>({
      defaultValues: {
        name: "",
        account_name: "",
        account_number: "",
        account_username: "",
        phone: "",
      },
    });

  useEffect(() => {
    register("name");
  }, [register]);

  const bankOptions = useMemo(
    () =>
      bankList.map((bank) => ({
        value: bank.name,
        label: bank.name,
      })),
    []
  );

  const watchedBankName = watch("name");

  const selectedBankOption = useMemo(
    () =>
      bankOptions.find((option) => option.value === watchedBankName) ?? null,
    [bankOptions, watchedBankName]
  );

  const handleBankChange = useCallback(
    (option: SingleValue<{ value: string; label: string }>) => {
      setValue("name", option?.value ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const location = useLocation();
  const navigate = useNavigate();

  // clear state
  const clearState = useCallback(() => {
    if (location.state?.new_order_created)
      navigate(location.pathname, { state: null });
  }, [location.state?.new_order_created, location.pathname, navigate]);

  const [showOrderSuccess, setShowOrderSuccess] = useState(
    !!location.state?.new_order_created
  );

  useEffect(() => {
    if (!order) return;

    if (order.payment?.method === PAYMENT_METHOD_EWALLET) {
      setValue("name", order.payment.info.name || "", { shouldValidate: true });
    } else if (order.payment?.method === PAYMENT_METHOD_BANK) {
      const bankOption = bankOptions.find(
        (option) => option.value === order.payment?.info?.name
      );

      if (bankOption) {
        setValue("name", bankOption.value, { shouldValidate: true });
      }
    }
  }, [order, bankOptions, setValue]);

  useEffect(() => {
    clearState();
  }, [clearState, location]);

  const onConfirm: SubmitHandler<ConfirmPaymentReqTypes> = (data) => {
    if (!orderId) return;

    mutate(
      { orderId, data: data },
      {
        onSuccess() {
          toast.success("Pesanan berhasil dikonfirmasi.");

          reset();
          resetMutation();

          onClose?.();

          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.ORDER, orderId],
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    resetMutation();

    onClose();

    setShowOrderSuccess(false);

    clearState();
  };

  return (
    <Modal
      show={show}
      centered
      onHide={handleClose}
      backdrop="static"
      animation
    >
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title>Konfirmasi Pembayaran</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onConfirm)}>
        <fieldset disabled={isPending}>
          <Modal.Body className="py-3">
            {isLoading && show && <Loading className="py-5" />}

            {order && (
              <>
                {showOrderSuccess && (
                  <div className="text-center mb-3">
                    <i className="bi bi-check-circle text-success display-1"></i>
                  </div>
                )}

                <Card body className="border-0 shadow-sm mb-4">
                  <PaymentInfo
                    paymentDueDate={order.payment_due_date}
                    payment={order.payment}
                  />
                </Card>

                <p className="text-muted text-center">
                  Konfirmasi pembayaran Anda dengan mengisi form di bawah ini.
                  Kami akan memverifikasi pembayaran Anda secepatnya.
                </p>

                <ErrorValidationAlert error={error} onClose={resetMutation} />

                {order?.payment?.method === PAYMENT_METHOD_BANK && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama Bank</Form.Label>
                      <Select
                        inputId="bank-select"
                        classNamePrefix="react-select"
                        options={bankOptions}
                        value={selectedBankOption}
                        onChange={handleBankChange}
                        isClearable
                        placeholder="Pilih Bank"
                        noOptionsMessage={() => "Bank tidak ditemukan"}
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama Pemilik Rekening</Form.Label>
                      <Form.Control type="text" {...register("account_name")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nomor Rekening</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("account_number")}
                      />
                    </Form.Group>
                  </>
                )}

                {order?.payment?.method === PAYMENT_METHOD_EWALLET && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>E-Wallet</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("name")}
                        value={order?.payment?.info?.name}
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama Akun</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("account_name")}
                        autoFocus
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Username Akun</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("account_username")}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>No. Handphone</Form.Label>
                      <Form.Control type="text" {...register("phone")} />
                    </Form.Group>
                  </>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="border-top-0">
            <Button variant="outline-secondary" onClick={handleClose}>
              Konfirmasi Nanti
            </Button>
            <Button variant="primary" type="submit">
              Konfirmasi Pembayaran
            </Button>
          </Modal.Footer>
        </fieldset>
      </Form>
    </Modal>
  );
};

export default ConfirmPaymentModal;
