import { Button, Form } from "react-bootstrap";
import type { WishlistTypes } from "../types/wishlist";
import { formatPrice } from "../utils/functions";
import ProductImage from "./ProductImage";
import {
  useWishlistDispatch,
  useWishlistState,
} from "../contexts/WishlistContext";
import { useDeleteWishlist } from "../services/api/wishlist";
import { useCreateCart } from "../services/api/cart";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/constans";

interface WishlistItemProps {
  item: WishlistTypes;
}

function WishlistItem({ item: { id, product } }: WishlistItemProps) {
  const { price, price_after_discount, is_discounted, discount_in_percent } =
    product;

  const isDiscounted = Boolean(is_discounted && price_after_discount != null);
  const currentPrice = isDiscounted
    ? price_after_discount ?? price
    : price;

  const discountPercent =
    typeof discount_in_percent === "number"
      ? Math.max(Math.round(discount_in_percent), 0)
      : price > 0 && price_after_discount != null
      ? Math.max(
          Math.round(((price - price_after_discount) / price) * 100),
          0
        )
      : null;

  const discountLabel =
    discountPercent && discountPercent > 0 ? `-${discountPercent}%` : null;
  const { selectedIds } = useWishlistState();
  const dispatch = useWishlistDispatch();
  const queryClient = useQueryClient();
  const deleteWishlistMutation = useDeleteWishlist();
  const createCartMutation = useCreateCart();

  const handleSelect = () => {
    dispatch({
      type: "SELECT",
      payload: id,
    });
  };

  const handleDelete = () => {
    deleteWishlistMutation.mutate(
      { wishlist_ids: [id] },
      {
        onSuccess: () => {
          dispatch({
            type: "DELETE",
            payload: id,
          });
        },
      }
    );
  };

  const handleMoveToCart = () => {
    createCartMutation.mutate(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Berhasil ditambahkan ke keranjang.");

          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CARTS] });

          handleDelete();
        },
      }
    );
  };

  return (
    <>
      {/* Mobile Only */}
      <div className="d-flex p-2 mb-2 border shadow-sm d-lg-none">
        <div
          className="d-flex justify-content-center align-items-center me-2"
          style={{ width: "5%" }}
        >
          <Form.Check
            type="checkbox"
            onChange={handleSelect}
            checked={selectedIds.includes(id)}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center me-2">
          <ProductImage url={product.image} alt={product.name} />
        </div>
        <div className="flex-grow-1">
          <p style={{ fontWeight: 500 }} className="mb-1">
            {product.name}
          </p>
          <p className="mb-1 text-gray-700 mb-1">
            {isDiscounted ? (
              <>
                <span className="text-danger me-2">
                  {formatPrice(currentPrice)}
                </span>
                <small className="text-gray-600">
                  (
                  <span className="text-decoration-line-through text-muted">
                    {formatPrice(price)}
                  </span>
                  {discountLabel && <span className="ms-1">{discountLabel}</span>}
                  )
                </small>
              </>
            ) : (
              formatPrice(currentPrice)
            )}
          </p>
          <div className="d-flex g-2 align-items-center justify-content-end">
            <Button
              variant="outline-danger"
              size="sm"
              className="me-2"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleMoveToCart}
            >
              <i className="bi bi-cart-plus"></i>
            </Button>
          </div>
        </div>
      </div>
      {/* End Mobile Only */}

      {/* Desktop Only */}
      <div className="d-flex flex-row align-items-center p-2 mb-2 border shadow-sm d-none d-lg-flex">
        <div className="text-center" style={{ width: "5%" }}>
          <Form.Check
            type="checkbox"
            onChange={handleSelect}
            checked={selectedIds.includes(id)}
          />
        </div>
        <div
          className="d-flex justify-content-start align-items-center"
          style={{ width: "50%" }}
        >
          <ProductImage
            width={60}
            url={product.image}
            alt={product.name}
            className="me-2"
          />
          <span style={{ fontWeight: 500 }}>{product.name}</span>
        </div>
        <div className="text-center" style={{ width: "20%" }}>
          {isDiscounted ? (
            <div className="d-flex flex-column align-items-center">
              <span>{formatPrice(currentPrice)}</span>
              <small className="text-gray-600">
                (
                <span className="text-decoration-line-through text-muted">
                  {formatPrice(price)}
                </span>
                {discountLabel && <span className="ms-1">{discountLabel}</span>}
                )
              </small>
            </div>
          ) : (
            formatPrice(currentPrice)
          )}
        </div>

        <div className="text-center" style={{ width: "25%" }}>
          <Button
            variant="outline-danger"
            size="sm"
            className="me-2"
            onClick={handleDelete}
          >
            <i className="bi bi-trash"></i>
          </Button>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMoveToCart}
          >
            <i className="bi bi-cart-plus"></i>
          </Button>
        </div>
      </div>
      {/* End Desktop Only */}
    </>
  );
}

export default WishlistItem;
