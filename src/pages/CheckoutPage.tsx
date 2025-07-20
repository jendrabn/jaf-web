import { useNavigate } from "react-router";
import Layout from "../layouts/Layout";
import { useCreateOrder } from "../services/api/order";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { formatPrice } from "../utils/functions";
import { toast } from "react-toastify";
import DeliveryAddressModal from "../components/Checkout/DeliveryAddressModal";
import DeliveryAddress from "../components/Checkout/DeliveryAddress";
import ProductOrderedList from "../components/Checkout/ProductOrderedList";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../contexts/CheckoutContext";
import { type OrderReqTypes } from "../types/order";
import { useCartDispatch } from "../contexts/CartContext";
import { Helmet } from "react-helmet-async";
import { QUERY_KEYS } from "../utils/constans";

function CheckoutPage() {
  const queryClient = useQueryClient();
  const createMutation = useCreateOrder();
  const navigate = useNavigate();
  const state = useCheckoutState();
  const dispatch = useCheckoutDispatch();
  const cartDispatch = useCartDispatch();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleCreateOrder = () => {
    if (!state.address) {
      toast.error("Silakan tambahkan alamat pengiriman terlebih dahulu");
      return;
    }

    if (!state.shipping) {
      toast.error("Silakan pilih metode pengiriman terlebih dahulu");
      return;
    }

    if (!state.paymentMethod) {
      toast.error("Silakan pilih metode pembayaran terlebih dahulu");
      return;
    }

    if (state.paymentMethod === "bank") {
      if (!state.bank) {
        toast.error("Silakan pilih bank terlebih dahulu");
        return;
      }
    } else if (state.paymentMethod === "ewallet") {
      if (!state.ewallet) {
        toast.error("Silakan pilih e-wallet terlebih dahulu");
        return;
      }
    }

    const requestData = {
      cart_ids: state.checkout?.carts.map((cart) => cart.id),
      shipping_address: {
        name: state.address?.name,
        phone: state.address?.phone,
        city_id: state.address?.city?.id,
        district: state.address?.district,
        postal_code: state.address?.postal_code,
        address: state.address?.address,
      },
      shipping_courier: state.shipping?.courier,
      shipping_service: state.shipping?.service,
      payment_method: state.paymentMethod,
      bank_id: state.bank?.id,
      ewallet_id: state.ewallet?.id,
      notes: state.note,
    };

    createMutation.mutate(requestData as OrderReqTypes, {
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
  };

  const handleShowAddressModal = () => {
    setShowAddressModal(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>Checkout | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <DeliveryAddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
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
          </div>
          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Ringkasan Pesanan</h5>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="text-gray-700">
                        Total Harga ({state.checkout?.total_quantity})
                      </td>
                      <td className="text-end">
                        {formatPrice(state.checkout?.total_price || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">
                        Biaya Pengiriman (
                        {Math.round((state.checkout?.total_weight || 0) / 1000)}
                        kg)
                      </td>
                      <td className="text-end">
                        {formatPrice(state.shipping?.cost || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">Pajak</td>
                      <td className="text-end">{formatPrice(0)}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">Jumlah Total</td>
                      <td className="text-end">
                        {formatPrice(
                          (state.checkout?.total_price || 0) +
                            (state.shipping?.cost || 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Form.Group>
                  <Form.Control
                    value={state.note}
                    placeholder="Catatan untuk penjual"
                    onChange={(e) => {
                      dispatch({ type: "SET_NOTE", payload: e.target.value });
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-grid">
              <Button
                variant="primary"
                onClick={handleCreateOrder}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Loading..." : "Buat Pesanan"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage;
