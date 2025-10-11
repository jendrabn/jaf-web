import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router";
import { useCheckoutState } from "../../services/api/order";
import { formatPrice } from "../../utils/functions";
import { Button, Form } from "react-bootstrap";
import { useDeleteCart } from "../../services/api/cart";
import CartItem from "../../components/shared/CartItem";
import { useCartDispatch, useCartState } from "../../contexts/CartContext";
import NoData from "../../components/ui/NoData";
import { Helmet } from "react-helmet-async";

function CartPage() {
  const navigate = useNavigate();
  const { carts, selectedIds, totalItem, totalPrice } = useCartState();
  const dispatch = useCartDispatch();
  const checkoutMutation = useCheckoutState();
  const deleteCartMutation = useDeleteCart();

  const handleCheckout = () => {
    checkoutMutation.mutate(
      { cart_ids: selectedIds },
      {
        onSuccess(data) {
          navigate("/checkout", { state: { checkout: data }, replace: true });
        },
      }
    );
  };

  const handleSelectAll = () => {
    dispatch({ type: "SELECT_ALL" });
  };

  const handleDeleteSelected = () => {
    deleteCartMutation.mutate(
      { cart_ids: selectedIds },
      {
        onSuccess() {
          dispatch({ type: "DELETE_SELECTED" });
        },
      }
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Keranjang Belanja | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="container">
        <h2 className="section__title">Keranjang Belanja</h2>

        {carts.length > 0 ? (
          <>
            {/* Dekstop */}
            <div className="d-flex px-2 py-3 d-none d-lg-flex fw-bold shadow-sm border mb-3">
              <div
                style={{ width: "5%" }}
                className="d-flex justify-content-center"
              >
                <Form.Check
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === carts.length
                  }
                  onChange={handleSelectAll}
                />
              </div>
              <div style={{ width: "40%" }} className="text-start">
                Produk
              </div>
              <div style={{ width: "15%" }} className="text-center">
                Harga Satuan
              </div>
              <div style={{ width: "15%" }} className="text-center">
                Kuantitas
              </div>
              <div style={{ width: "15%" }} className="text-center">
                Total
              </div>
              <div style={{ width: "10%" }} className="text-center">
                Aksi
              </div>
            </div>

            <div className="d-flex flex-column">
              {carts.map((cart) => (
                <CartItem key={`cart-item-${cart.id}`} cart={cart} />
              ))}
            </div>

            {/* Dekstop Only */}
            <div className="d-flex justify-content-between align-items-center mt-3 d-none d-lg-flex">
              <Button
                variant="outline-danger"
                onClick={handleDeleteSelected}
                disabled={
                  selectedIds.length === 0 || deleteCartMutation.isPending
                }
              >
                Hapus
              </Button>

              <div className="d-flex align-items-center">
                <p className="mb-0 me-3">
                  Total ({totalItem} item):{" "}
                  <span className="fw-bold fs-4">
                    {formatPrice(totalPrice)}
                  </span>
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={
                    selectedIds.length === 0 || checkoutMutation.isPending
                  }
                  onClick={handleCheckout}
                >
                  {checkoutMutation.isPending ? "Loading..." : "Checkout"}
                </Button>
              </div>
            </div>
            {/* End Dekstop Only */}

            {/* Mobile Only */}
            <div className="flex-grow-1 mt-1 d-lg-none">
              <div className="d-flex px-2 py-3 shadow-sm border mb-3 align-items-center justify-content-between mb-1">
                <Form.Check
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === carts.length
                  }
                  onChange={handleSelectAll}
                  label="Pilih Semua"
                />

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={
                    selectedIds.length === 0 || deleteCartMutation.isPending
                  }
                >
                  Hapus
                </Button>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-1">
                <p className="fw-bold">Total ({totalItem} produk)</p>
                <p className="fw-bold fs-6">{formatPrice(totalPrice)}</p>
              </div>

              <div className="d-grid">
                <Button
                  variant="primary"
                  disabled={
                    selectedIds.length === 0 || checkoutMutation.isPending
                  }
                  onClick={handleCheckout}
                >
                  {checkoutMutation.isPending ? "Loading..." : "Checkout"}
                </Button>
              </div>
            </div>
            {/* End Mobile Only */}
          </>
        ) : (
          <NoData />
        )}
      </div>
    </Layout>
  );
}

export default CartPage;
