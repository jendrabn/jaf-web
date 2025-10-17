import type { ProductItemTypes } from "@/types/product";
import { Card, Image } from "react-bootstrap";
import { formatCurrency } from "@/utils/format";
import { Link } from "react-router";

interface ProductItemProps {
  product: ProductItemTypes;
  showSoldCount?: boolean;
  showRating?: boolean;
}

const ProductItem = (props: ProductItemProps) => {
  const { product, showSoldCount = true, showRating = true } = props;

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
      ? Math.max(Math.round(((price - price_after_discount) / price) * 100), 0)
      : null;
  const discountLabel =
    discountPercent && discountPercent > 0 ? `-${discountPercent}%` : null;

  return (
    <Card className="h-100 text-decoration-none border-0 hover-up">
      <Link to={`/products/${id}`} className="text-decoration-none">
        <div className="w-100 ratio ratio-1x1 bg-gray-300 overflow-hidden rounded-3 img-hover-zoom">
          <Image
            src={image}
            alt={name}
            loading="lazy"
            className="w-100 h-100 object-fit-cover"
          />
        </div>
      </Link>

      <Card.Body className="px-0">
        <Card.Title className="fs-6 line-clamp-2" title={name}>
          <Link
            className="text-body-emphasis text-decoration-none hover-text-primary"
            to={`/products/${id}`}
          >
            {name}
          </Link>
        </Card.Title>
        <Card.Text>
          {isDiscounted ? (
            <>
              <span className="fw-semibold text-danger">
                {formatCurrency(currentPrice)}
              </span>
              <small className="text-body-secondary fw-normal d-block">
                <span className="text-decoration-line-through me-2">
                  {formatCurrency(price)}
                </span>
                {discountLabel && <span>{discountLabel}</span>}
              </small>
            </>
          ) : (
            <span className="fw-semibold">{formatCurrency(currentPrice)}</span>
          )}
        </Card.Text>
        {(showRating || showSoldCount) && (
          <div className="d-flex justify-content-between align-items-center small text-body-secondary">
            {showRating && (
              <div>
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span>{product.rating_avg}</span>
              </div>
            )}
            {showSoldCount && <span>{sold_count} Terjual</span>}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
