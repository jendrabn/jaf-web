import { NavLink } from "react-router";
import { ProductItemTypes } from "../types/product";
import { formatPrice } from "../utils/functions";

interface ProductItemProps {
  product: ProductItemTypes;
}

export default function ProductItem({ product }: ProductItemProps) {
  const { id, name, image, price, sold_count } = product;

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

      <div className="card-body" style={{ padding: "0.5rem" }}>
        <div className="card__product-item-name title-truncate fs-6 mb-1">
          {name}
        </div>
        <div className="card__product-item-price h5 mb-2 fw-bold">
          {formatPrice(price)}
        </div>
        <div className="card__product-item-rating-and-sold d-flex justify-content-between align-items-center fs-6 text-gray-700">
          <div className="card__product-item-rating">
            {/* <i className="fa fa-star text-warning"></i> 5 */}
          </div>
          <div className="card__product-item-sold">{sold_count} Sold</div>
        </div>
      </div>
    </NavLink>
  );
}
