import { useLocation, useNavigate } from "react-router";
import Layout from "../layouts/Layout";
import { CheckoutTypes, ShippingCostTypes } from "../types/checkout";
import { useCreateOrder, useFetchShippingCosts } from "../services/api/order";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { formatToRupiah } from "../utils/functions";
import { toast } from "react-toastify";
import DeliveryAddressModal from "../components/Checkout/DeliveryAddressModal";
import { OrderReqTypes } from "../types/order";
// import { BankTypes, EwalletTypes } from "../types/payment-method";
import DeliveryAddress from "../components/Checkout/DeliveryAddress";
import ProductOrderedList from "../components/Checkout/ProductOrderedList";
import PaymentMethod from "../components/Checkout/PaymentMethod";

function CheckoutPage() {
  const location = useLocation();
  const createMutation = useCreateOrder();
  const shippingCostMutation = useFetchShippingCosts();
  const navigate = useNavigate();

  const {
    shipping_address,
    carts,
    payment_methods,
    shipping_methods,
    total_price,
    total_weight,
    total_quantity,
  }: CheckoutTypes = location.state || {};

  const [shippingCosts, setShippingCosts] = useState<ShippingCostTypes[]>(
    shipping_methods || []
  );
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingCostTypes | null>(null);
  // const [selectedPaymentBank, setSelectedPaymentBank] =
  //   useState<BankTypes | null>();
  // const [selectedPaymentEwallet, setSelectedPaymentEwallet] =
  //   useState<EwalletTypes | null>();

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [data, setData] = useState<OrderReqTypes>({
    cart_ids: carts?.map((cart) => cart.id) || [],
    shipping_address: {
      name: shipping_address?.name || "",
      phone: shipping_address?.phone || "",
      city_id: shipping_address?.city?.id || 0,
      district: shipping_address?.district || "",
      postal_code: shipping_address?.postal_code || "",
      address: shipping_address?.address || "",
    },
    shipping_courier: undefined,
    shipping_service: "",
    payment_method: undefined,
    bank_id: undefined,
    notes: "",
  });

  useEffect(() => {
    if (!location.state) navigate("/cart");
  }, [location.state, navigate]);

  const handleCreateOrder = () => {
    createMutation.mutate(data, {
      onSuccess: (data) => {
        // dispatch({ type: "DELETE_SELECTED_CARTS" });

        toast.success("Order created successfully");

        navigate("/order-success", {
          replace: true,
          state: data,
        });
      },
    });
  };

  const handleShowAddressModal = () => {
    setShowAddressModal(true);
  };

  const handleSubmitAddressModal = (
    data: OrderReqTypes["shipping_address"]
  ) => {
    setShowAddressModal(false);

    setData((prev) => ({
      ...prev,
      shipping_address: data,
    }));

    shippingCostMutation.mutate(
      {
        destination: data.city_id,
        weight: total_weight || 0,
      },
      {
        onSuccess: (data) => {
          setShippingCosts(data);
          setSelectedShipping(null);
        },
      }
    );
  };

  return (
    <Layout title="Checkout">
      <DeliveryAddressModal
        address={shipping_address}
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleSubmitAddressModal}
      />

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <DeliveryAddress
              className="mb-3"
              address={shipping_address}
              handleShowAddressModal={handleShowAddressModal}
            />

            <ProductOrderedList
              className="mb-3"
              carts={carts}
              shippingCosts={shippingCosts}
              notes={data.notes}
              onChangeNotes={(notes) => setData((prev) => ({ ...prev, notes }))}
              onChangeShipping={(shipping) => {
                setSelectedShipping(shipping);

                setData((prevData) => ({
                  ...prevData,
                  shipping_courier:
                    shipping.courier as OrderReqTypes["shipping_courier"],
                  shipping_service:
                    shipping.service as OrderReqTypes["shipping_service"],
                }));
              }}
            />

            <PaymentMethod
              paymentMethod={data.payment_method}
              paymentBanks={payment_methods?.bank || []}
              paymentEwallets={payment_methods?.ewallet || []}
              bankId={data.bank_id}
              onChangePaymentMethod={(method) => {
                setData((prevData) => ({
                  ...prevData,
                  payment_method: method as OrderReqTypes["payment_method"],
                }));
              }}
              onChangePaymentBank={(bank) => {
                // setSelectedPaymentBank(bank);

                setData((prevData) => ({
                  ...prevData,
                  bank_id: bank.id,
                }));
              }}
              onChangePaymentEwallet={(ewallet) => {
                // setSelectedPaymentEwallet(ewallet);

                setData((prevData) => ({
                  ...prevData,
                  ewallet_id: ewallet.id,
                }));
              }}
            />
          </div>
          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td className="text-gray-700">
                        Total Price ({total_quantity})
                      </td>
                      <td className="text-end">
                        {formatToRupiah(total_price || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">
                        Shipping Cost ({Math.round(total_weight / 1000)}kg)
                      </td>
                      <td className="text-end">
                        {formatToRupiah(selectedShipping?.cost || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">Tax</td>
                      <td className="text-end">{formatToRupiah(0)}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-700">Total Amount</td>
                      <td className="text-end">
                        {formatToRupiah(
                          (total_price || 0) + (selectedShipping?.cost || 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Form.Group>
                  <Form.Control
                    value={data.notes}
                    placeholder="Please leave a message for seller..."
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, notes: e.target.value }))
                    }
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
                {createMutation.isPending ? "Loading..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage;
