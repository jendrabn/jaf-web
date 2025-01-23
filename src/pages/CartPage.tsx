import Layout from "../layouts/Layout";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router";
import { useCheckout } from "../services/api/order";
import { formatToRupiah } from "../utils/functions";
import { Button, Form, Table } from "react-bootstrap";
import ProductImage from "../components/ProductImage";
import QuantityInput from "../components/QuantityInput";

function CartPage() {
  const {
    carts,
    selectedIds,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteSelected,
    handleUpdate,
    totalItem,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();
  const checkoutMutation = useCheckout();

  const handleCheckout = () => {
    checkoutMutation.mutate(
      { cart_ids: selectedIds },
      {
        onSuccess(data) {
          navigate("/checkout", { state: data, replace: true });
        },
      }
    );
  };

  return (
    <Layout title="Cart">
      <div className="container">
        <h1 className="h2 fw-bold mb-3">Shopping Cart</h1>

        <div className="card">
          <div className="card-body p-5">
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
                  <tr key={`cart-${cart.id}`}>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(cart.id)}
                        onChange={() => handleSelect(cart.id)}
                      />
                    </td>
                    <td>
                      <ProductImage
                        url={cart.product.image}
                        alt={cart.product.name}
                        className="me-2"
                      />
                      {cart.product.name}
                    </td>
                    <td>{formatToRupiah(cart.product.price)}</td>
                    <td className="text-center">
                      <QuantityInput
                        onChange={(quantity) => handleUpdate(cart.id, quantity)}
                        maxValue={cart.product.stock}
                        initialValue={cart.quantity}
                        size="sm"
                      />
                    </td>
                    <td>
                      {formatToRupiah(cart.product.price * cart.quantity)}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(cart.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="outline-danger"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                Delete Selected
              </Button>

              <div className="d-flex align-items-center">
                <p className="d-flex align-items-center mb-0 me-3">
                  Total ({totalItem} item):
                  <span className="fw-bold fs-5 ms-2">
                    {formatToRupiah(totalPrice)}
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
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;
