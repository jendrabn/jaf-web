import Layout from "../layouts/Layout";
import { useNavigate } from "react-router";
import { useCheckoutState } from "../services/api/order";
import { formatPrice } from "../utils/functions";
import { Button, Card, Form, Table } from "react-bootstrap";
import { useDeleteCart } from "../services/api/cart";
import CartItem from "../components/CartItem";
import { useCartDispatch, useCartState } from "../contexts/CartContext";

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
    <Layout title="Cart">
      <div className="container">
        <h2 className="section__title">Shopping Cart</h2>

        <Card>
          <Card.Body>
            {carts.length > 0 ? (
              <>
                <Table responsive className="align-middle">
                  <thead>
                    <tr>
                      <th className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={
                            selectedIds.length > 0 &&
                            selectedIds.length === carts.length
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-center">Product</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Total Price</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((cart) => (
                      <CartItem key={`cart-item-${cart.id}`} cart={cart} />
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="outline-danger"
                    onClick={handleDeleteSelected}
                    disabled={
                      selectedIds.length === 0 || deleteCartMutation.isPending
                    }
                  >
                    Delete Selected
                  </Button>

                  <div className="d-flex align-items-center">
                    <p className="d-flex align-items-center mb-0 me-3">
                      Total ({totalItem} item):
                      <span className="fw-bold fs-5 ms-2">
                        {formatPrice(totalPrice)}
                      </span>
                    </p>
                    <Button
                      variant="primary"
                      className="px-5"
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
              </>
            ) : (
              <p className="text-center text-muted">Cart is empty</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}

export default CartPage;
