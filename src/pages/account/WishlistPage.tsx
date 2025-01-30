import AccountLayout from "../../layouts/AccountLayout";
import {
  useWishlistDispatch,
  useWishlistState,
} from "../../contexts/WishlistContext";
import { Button, Form, Table } from "react-bootstrap";
import WishlistItem from "../../components/WishlistItem";
import { useDeleteWishlist } from "../../services/api/wishlist";

function WishlistPage() {
  const deleteWishlistMutation = useDeleteWishlist();
  const { wishlists, selectedIds } = useWishlistState();
  const dispatch = useWishlistDispatch();

  const handleSelectAll = () => {
    dispatch({ type: "SELECT_ALL" });
  };

  const handleDeleteSelected = () => {
    deleteWishlistMutation.mutate(
      { wishlist_ids: selectedIds },
      {
        onSuccess: () => {
          dispatch({ type: "DELETE_SELECTED" });
        },
      }
    );
  };

  return (
    <AccountLayout title="My Wishlist">
      {wishlists && wishlists?.length > 0 ? (
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
                <WishlistItem key={`wishlist-item-${item.id}`} item={item} />
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
      ) : (
        <p className="text-center text-muted ">Your wishlist is empty</p>
      )}
    </AccountLayout>
  );
}

export default WishlistPage;
