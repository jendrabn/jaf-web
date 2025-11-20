import type { ProductItemTypes } from "@/types/product";
import { Card, Image } from "react-bootstrap";
import { formatCurrency } from "@/utils/format";
import { Link } from "react-router";
import {
  getProductPricingInfo,
  type FlashSaleStatusOverride,
} from "@/utils/pricing";

interface ProductItemProps {
  product: ProductItemTypes;
  showSoldCount?: boolean;
  showRating?: boolean;
  flashSaleStatus?: FlashSaleStatusOverride;
  hideZeroSoldCount?: boolean;
}

const ProductItem = (props: ProductItemProps) => {
  const {
    product,
    showSoldCount = true,
    showRating = true,
    flashSaleStatus,
    hideZeroSoldCount = false,
  } = props;

  const { slug, name, image, sold_count } = product;

  const pricing = getProductPricingInfo(product, flashSaleStatus);
  const {
    currentPrice,
    originalPrice,
    discountPercent,
    strikeThroughPrice,
    displayText,
    isFlashSale,
    isScheduledFlashSale,
    isDiscounted,
  } = pricing;

  const discountLabel =
    discountPercent && discountPercent > 0 ? `-${discountPercent}%` : null;

  const showStrikeThrough =
    Boolean(strikeThroughPrice) &&
    (isFlashSale || isDiscounted) &&
    strikeThroughPrice !== currentPrice;

  const flashStock = product.flash_stock ?? null;
  const flashRemaining = product.flash_stock_remaining ?? null;
  const flashSold = product.flash_sold ?? null;
  const showFlashStock =
    (flashSaleStatus === "running" || isFlashSale) &&
    flashStock != null &&
    flashRemaining != null &&
    flashStock > 0;

  const soldLabel = hideZeroSoldCount
    ? null
    : isScheduledFlashSale
    ? "Segera Hadir"
    : `${sold_count} Terjual`;

  const soldPercentage = showFlashStock
    ? Math.min(
        100,
        Math.max(((flashStock - flashRemaining) / (flashStock || 1)) * 100, 0)
      )
    : 0;

  return (
    <Card className="h-100 text-decoration-none border-0 hover-up position-relative">
      {(isFlashSale || flashSaleStatus === "scheduled") && (
        <span className="badge bg-primary position-absolute top-0 start-0 m-2 z-1">
          Flash Sale
        </span>
      )}

      <Link to={`/products/${slug}`} className="text-decoration-none">
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
            to={`/products/${slug}`}
          >
            {name}
          </Link>
        </Card.Title>
        <Card.Text>
          {displayText ? (
            <span className="fw-semibold text-danger">{displayText}</span>
          ) : (
            <>
              <span className="fw-semibold text-danger">
                {formatCurrency(currentPrice ?? originalPrice)}
              </span>
              {showStrikeThrough && (
                <small className="text-body-secondary fw-normal d-block">
                  <span className="text-decoration-line-through me-2">
                    {formatCurrency(strikeThroughPrice ?? originalPrice)}
                  </span>
                  {discountLabel && <span>{discountLabel}</span>}
                </small>
              )}
            </>
          )}
          {!displayText && !showStrikeThrough && discountLabel && (
            <div className="text-danger small fw-semibold">{discountLabel}</div>
          )}
        </Card.Text>

        {showFlashStock && (
          <div className="flash-sale-stock mb-2">
            <div className="d-flex justify-content-between text-danger text-xs">
              <span>
                Sisa {flashRemaining} <i className="bi bi-fire"></i>
              </span>
              <span>Terjual {flashSold ?? flashStock - flashRemaining}</span>
            </div>
            <div className="flash-sale-stock-progress">
              <div
                className="flash-sale-stock-progress-bar"
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {(showRating || showSoldCount) && (
          <div className="d-flex justify-content-between align-items-center small text-body-secondary">
            {showRating && (
              <div>
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span>{product.rating_avg}</span>
              </div>
            )}
            {showSoldCount && soldLabel && <span>{soldLabel}</span>}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
