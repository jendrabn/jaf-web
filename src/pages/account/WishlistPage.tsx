import { useQueryClient } from "@tanstack/react-query";
import AccountLayout from "../../layouts/AccountLayout";
import { useCreateCart } from "../../services/api/cart";
import { toast } from "react-toastify";
import { useWishlist } from "../../contexts/WishlistContext";
import { Button, Form, Table } from "react-bootstrap";
import ProductImage from "../../components/ProductImage";
import { formatToRupiah } from "../../utils/functions";

function WishlistPage() {
  const queryClient = useQueryClient();
  const createCartMutation = useCreateCart();

  const {
    wishlists,
    selectedIds,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleDeleteSelected,
  } = useWishlist();

  const handleMoveToCart = (productId: number, wishlistId: number) => {
    createCartMutation.mutate(
      { product_id: productId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Item has been moved to your shopping cart.");

          handleDelete(wishlistId);

          queryClient.invalidateQueries({ queryKey: ["carts"] });
        },
      }
    );
  };
  return (
    <AccountLayout title="My Wishlist">
      {wishlists && wishlists?.length > 0 && (
        <>
          <Table responsive className="align-middle">
            <thead>
              <tr>
                <th className="text-center">
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === wishlists.length}
                  />
                </th>
                <th className="text-center">Product</th>
                <th className="text-center">Price</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlists?.map((item) => (
                <tr key={item.id}>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      onChange={() => handleSelect(item.id)}
                      checked={selectedIds.includes(item.id)}
                    />
                  </td>
                  <td>
                    <ProductImage
                      url={item.product.image}
                      alt={item.product.name}
                      className="me-2"
                    />
                    <span>{item.product.name}</span>
                  </td>
                  <td className="text-center">
                    {formatToRupiah(item.product.price)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleMoveToCart(item.product.id, item.id)}
                    >
                      <i className="bi bi-cart-plus"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-start mt-3">
            <Button
              variant="outline-danger"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          </div>
        </>
      )}
    </AccountLayout>
  );
}

export default WishlistPage;
