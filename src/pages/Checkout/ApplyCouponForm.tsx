import { type FormEvent, useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useApplyCoupon } from "@/hooks/api/order";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "@/contexts/CheckoutContext";
import { formatCurrency, toNumber } from "@/utils/functions";

const APPLY_COUPON_ERROR_TOAST = "apply-coupon-error";
const APPLY_COUPON_SUCCESS_TOAST = "apply-coupon-success";
const APPLY_COUPON_INFO_TOAST = "apply-coupon-info";

const ApplyCouponForm: React.FC = () => {
  const { checkout, coupon } = useCheckoutState();
  const dispatch = useCheckoutDispatch();
  const [code, setCode] = useState("");
  const applyCoupon = useApplyCoupon();

  const couponLabel = coupon?.code || coupon?.name || "Kupon";
  const discountSubtotal = checkout?.total_price ?? 0;
  const rawAppliedDiscount =
    coupon?.computed_discount_amount ?? toNumber(coupon?.discount_amount);
  const appliedDiscount = Math.min(
    Math.max(rawAppliedDiscount, 0),
    discountSubtotal
  );

  useEffect(() => {
    if (coupon?.code) {
      setCode(coupon.code);
    }
  }, [coupon?.code]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      toast.error("Silakan masukkan kode kupon");
      return;
    }

    const cartIds = checkout?.carts?.map((cart) => cart.id) ?? [];
    if (!cartIds.length) {
      toast.error("Keranjang belanja kosong");
      return;
    }

    applyCoupon.mutate(
      {
        code: trimmedCode,
        cart_ids: cartIds,
      },
      {
        onSuccess: (response) => {
          const couponData = response?.data ?? null;

          if (!couponData) {
            toast.error("Respons kupon tidak valid", {
              toastId: APPLY_COUPON_ERROR_TOAST,
            });
            return;
          }

          const rawDiscountValue =
            response.discount_amount ?? couponData.discount_amount;
          const rawDiscountNumber = toNumber(rawDiscountValue);
          const orderSubtotal = checkout?.total_price ?? 0;

          let calculatedDiscount = rawDiscountNumber;
          if (couponData.discount_type === "percentage") {
            calculatedDiscount = Math.round(
              (orderSubtotal * rawDiscountNumber) / 100
            );
          }

          const cappedDiscount = Math.min(
            Math.max(calculatedDiscount, 0),
            orderSubtotal
          );

          const payload: typeof couponData = {
            ...couponData,
            discount_value: rawDiscountValue,
            computed_discount_amount: cappedDiscount,
            discount_amount: cappedDiscount,
          };

          dispatch({ type: "SET_COUPON", payload });
          const couponIdentifier = payload.code || payload.name;
          const successMessage =
            response.message ??
            (couponIdentifier
              ? `Kupon ${couponIdentifier} berhasil diterapkan`
              : "Kupon berhasil diterapkan");
          toast.success(successMessage, {
            toastId: APPLY_COUPON_SUCCESS_TOAST,
          });
        },
        // onError: (error: unknown) => {
        //   const message =
        //     (error as { response?: { data?: { message?: string } } })?.response
        //       ?.data?.message ?? "Kupon tidak valid";
        //   toast.error(message, { toastId: APPLY_COUPON_ERROR_TOAST });
        // },
      }
    );
  };

  const handleRemove = () => {
    dispatch({ type: "SET_COUPON", payload: null });
    setCode("");
    toast.info("Kupon dihapus", { toastId: APPLY_COUPON_INFO_TOAST });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-3">Kupon</h5>

        <Form onSubmit={handleSubmit} className="mb-3">
          <InputGroup>
            <Form.Control
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Masukkan kode kupon"
              disabled={applyCoupon.isPending}
            />
            <Button
              type="submit"
              variant="outline-primary"
              disabled={applyCoupon.isPending}
            >
              {applyCoupon.isPending ? "Menerapkan..." : "Terapkan"}
            </Button>
            {coupon && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleRemove}
                disabled={applyCoupon.isPending}
              >
                Batalkan
              </Button>
            )}
          </InputGroup>
          {coupon && (
            <Form.Text className="text-success">
              {couponLabel} aktif. Diskon {formatCurrency(appliedDiscount)}.
            </Form.Text>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ApplyCouponForm;
