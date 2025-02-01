import AccountLayout from "../../layouts/AccountLayout";
import {
  useWishlistDispatch,
  useWishlistState,
} from "../../contexts/WishlistContext";
import { Button, Form } from "react-bootstrap";
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
          {/* Desktop */}
          <div className="d-flex align-items-center px-2 py-3 mb-2 fw-bold border shadow-sm d-none d-lg-flex">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "5%" }}
            >
              <Form.Check
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedIds.length === wishlists.length}
              />
            </div>
            <div className="text-center" style={{ width: "50%" }}>
              Product
            </div>
            <div className="text-center" style={{ width: "20%" }}>
              Price
            </div>
            <div className="text-center" style={{ width: "25%" }}>
              Action
            </div>
          </div>

          <div className="d-flex flex-column">
            {wishlists?.map((item) => (
              <WishlistItem key={`wishlist-item-${item.id}`} item={item} />
            ))}
          </div>

          {/* Mobile */}
          <div className="d-flex justify-content-between align-items-center p-2 border shadow-sm d-lg-none">
            <Form.Check
              type="checkbox"
              onChange={handleSelectAll}
              checked={selectedIds.length === wishlists.length}
              label="Select All"
            />
            <Button
              variant="outline-danger"
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          </div>

          {/* Desktop */}
          <div className="d-flex justify-content-start mt-3 d-none d-lg-flex">
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
