import { NavLink } from "react-router";
import type { ProductItemTypes } from "../types/product";
import { formatPrice } from "../utils/functions";

interface ProductItemProps {
  product: ProductItemTypes;
  showSoldCount?: boolean;
  showRating?: boolean;
}

export default function ProductItem({
  product,
  showSoldCount = true,
  showRating = true,
}: ProductItemProps) {
  const {
    id,
    name,
    image,
    price,
    price_after_discount,
    is_discounted,
    discount_in_percent,
    sold_count,
  } = product;

  const isDiscounted = Boolean(is_discounted && price_after_discount != null);
  const currentPrice = isDiscounted ? price_after_discount ?? price : price;
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

  return (
    <NavLink
      to={`/products/${id}`}
      className="card card__product-item text-decoration-none bg-gray-100 h-100"
    >
      <figure
        className="card__product-item-image w-100 bg-gray-300 m-0"
        style={{ aspectRatio: "1/1" }}
      >
        <img
          src={image}
          className="object-fit-contain w-100 h-100 card-img-top"
          alt={name}
          loading="lazy"
        />
      </figure>

      <div
        className="card-body d-flex flex-column justify-content-between"
        style={{ padding: "0.5rem" }}
      >
        <div>
          <div className="card__product-item-name title-truncate fs-6 mb-1">
            {name}
          </div>
          <div className="card__product-item-price h5 mb-2 fw-bold">
            {isDiscounted ? (
              <>
                <span className="text-danger me-2">
                  {formatPrice(currentPrice)}
                </span>
                <small className="text-gray-600 fw-normal d-block">
                  <span className="text-decoration-line-through me-2">
                    {formatPrice(price)}
                  </span>
                  {discountLabel && <span>{discountLabel}</span>}
                </small>
              </>
            ) : (
              formatPrice(currentPrice)
            )}
          </div>
        </div>

        <div className="card__product-item-rating-and-sold d-flex justify-content-between align-items-center text-gray-700 mt-auto">
          {showRating && (
            <div className="card__product-item-rating">
              <i className="fa fa-star text-warning"></i>
              <span className="ms-1">{product.rating_avg}</span>
            </div>
          )}
          {showSoldCount && (
            <div className="card__product-item-sold">{sold_count} Terjual</div>
          )}
        </div>
      </div>
    </NavLink>
  );
}
