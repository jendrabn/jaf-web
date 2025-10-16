import { useNavigate } from "react-router";
import Layout from "../../components/layouts/Layout";
import { useCreateOrder } from "../../hooks/api/order";
import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { formatPrice, toNumber } from "../../utils/functions";
import { toast } from "react-toastify";
import DeliveryAddressModal from "./DeliveryAddressModal";
import DeliveryAddress from "./DeliveryAddress";
import ProductOrderedList from "./ProductOrderedList";
import PaymentMethod from "./PaymentMethod";
import ApplyCouponForm from "./ApplyCouponForm";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import { type OrderReqTypes } from "../../types/order";
import { useCartDispatch } from "../../contexts/CartContext";
import { Helmet } from "react-helmet-async";
import { QUERY_KEYS } from "../../utils/constans";

function CheckoutPage() {
  const queryClient = useQueryClient();
  const createMutation = useCreateOrder();
  const navigate = useNavigate();
  const state = useCheckoutState();
  const dispatch = useCheckoutDispatch();
  const cartDispatch = useCartDispatch();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const {
    checkout,
    address,
    shipping,
    paymentMethod,
    bank,
    ewallet,
    note,
    coupon,
  } = state;

  const {
    subtotal,
    totalTax,
    shippingCost,
    discountAmount,
    couponLabel,
    grandTotal,
    totalQuantity,
    totalWeightKg,
  } = useMemo(() => {
    const checkoutSubtotal = checkout?.total_price ?? 0;
    const checkoutTaxes = checkout?.total_tax ?? 0;
    const checkoutShipping = shipping?.cost ?? 0;
    const totalQuantityValue = checkout?.total_quantity ?? 0;
    const totalWeightValue = checkout?.total_weight ?? 0;
    const rawDiscount =
      coupon?.computed_discount_amount ?? toNumber(coupon?.discount_amount);
    const sanitizedDiscount = Math.min(
      Math.max(rawDiscount, 0),
      checkoutSubtotal
    );
    const label = coupon?.code || coupon?.name || "Kupon";
    const weightKg = Math.round(totalWeightValue / 1000);

    return {
      subtotal: checkoutSubtotal,
      totalTax: checkoutTaxes,
      shippingCost: checkoutShipping,
      discountAmount: sanitizedDiscount,
      couponLabel: label,
      grandTotal:
        Math.max(checkoutSubtotal - sanitizedDiscount, 0) +
        checkoutShipping +
        checkoutTaxes,
      totalQuantity: totalQuantityValue,
      totalWeightKg: weightKg,
    };
  }, [checkout, shipping, coupon]);

  const hasDiscount = discountAmount > 0;
  const isSubmitting = createMutation.isPending;

  const handleShowAddressModal = useCallback(() => {
    setShowAddressModal(true);
  }, []);

  const handleHideAddressModal = useCallback(() => {
    setShowAddressModal(false);
  }, []);

  const handleNoteChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch({ type: "SET_NOTE", payload: event.target.value });
    },
    [dispatch]
  );

  const validateOrder = useCallback(() => {
    if (!address) {
      toast.error("Silakan tambahkan alamat pengiriman terlebih dahulu");
      return false;
    }

    if (!shipping) {
      toast.error("Silakan pilih metode pengiriman terlebih dahulu");
      return false;
    }

    if (!paymentMethod) {
      toast.error("Silakan pilih metode pembayaran terlebih dahulu");
      return false;
    }

    if (paymentMethod === "bank" && !bank) {
      toast.error("Silakan pilih bank terlebih dahulu");
      return false;
    }

    if (paymentMethod === "ewallet" && !ewallet) {
      toast.error("Silakan pilih e-wallet terlebih dahulu");
      return false;
    }

    return true;
  }, [address, shipping, paymentMethod, bank, ewallet]);

  const buildOrderPayload = useCallback((): OrderReqTypes => {
    return {
      cart_ids: checkout?.carts?.map((cart) => cart.id),
      shipping_address: {
        name: address?.name,
        phone: address?.phone,
        province_id: address?.province?.id,
        city_id: address?.city?.id,
        district_id: address?.district?.id,
        subdistrict_id: address?.subdistrict?.id,
        zip_code: address?.zip_code,
        address: address?.address,
      },
      shipping_courier: shipping?.courier,
      shipping_service: shipping?.service,
      payment_method: paymentMethod,
      bank_id: bank?.id,
      ewallet_id: ewallet?.id,
      note: note,
      ...(coupon?.code ? { coupon_code: coupon.code } : {}),
    };
  }, [checkout, address, shipping, paymentMethod, bank, ewallet, note, coupon]);

  const handleCreateOrder = useCallback(() => {
    if (!validateOrder()) {
      return;
    }

    const payload = buildOrderPayload();

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success("Pesanan berhasil dibuat.");

        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARTS] });
        cartDispatch({ type: "SET_SELECTED_IDS", payload: [] });
        dispatch({ type: "RESET" });

        navigate(`/account/orders/${data.id}`, {
          replace: true,
          state: {
            new_order_created: true,
          },
        });
      },
    });
  }, [
    validateOrder,
    buildOrderPayload,
    createMutation,
    queryClient,
    cartDispatch,
    dispatch,
    navigate,
  ]);

  return (
    <Layout>
      <Helmet>
        <title>Checkout & Pembayaran | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <DeliveryAddressModal
        show={showAddressModal}
        onClose={handleHideAddressModal}
      />

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <DeliveryAddress
              className="mb-3"
              handleShowAddressModal={handleShowAddressModal}
            />

            <ProductOrderedList className="mb-3" />

            <PaymentMethod />

            <div className="mt-3">
              <ApplyCouponForm />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Ringkasan Pesanan</h5>

                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="text-secondary-emphasis">
                        Total Harga ({totalQuantity})
                      </td>
                      <td className="text-end">{formatPrice(subtotal)}</td>
                    </tr>
                    <tr>
                      <td className="text-secondary-emphasis">
                        Biaya Pengiriman ({totalWeightKg} kg)
                      </td>
                      <td className="text-end">{formatPrice(shippingCost)}</td>
                    </tr>
                    {hasDiscount && (
                      <tr>
                        <td className="text-secondary-emphasis text-success">
                          Diskon ({couponLabel})
                        </td>
                        <td className="text-end text-success">
                          -{formatPrice(discountAmount)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-secondary-emphasis">
                        <div>Pajak</div>
                        <div className="text-muted small">
                          {checkout?.taxes.map((tax) => (
                            <span className="me-1" key={tax.id}>
                              {tax.name} ({tax.rate}%)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-end">{formatPrice(totalTax)}</td>
                    </tr>
                    <tr>
                      <td className="text-secondary-emphasis">Jumlah Total</td>
                      <td className="text-end">{formatPrice(grandTotal)}</td>
                    </tr>
                  </tbody>
                </Table>

                <Form.Group>
                  <Form.Control
                    value={note}
                    placeholder="Catatan untuk penjual"
                    onChange={handleNoteChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-grid">
              <Button
                variant="primary"
                onClick={handleCreateOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Buat Pesanan"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default CheckoutPage;
