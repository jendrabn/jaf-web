import { useState } from "react";
import { Accordion } from "react-bootstrap";
import {
  useFetchProductBrands,
  useFetchProductCategories,
} from "../services/api/product";
import type { ProductParamsTypes } from "../types/product";
import useFilters from "../hooks/useFilters";
import { SEXS } from "../utils/constans";

function ProductListFilters() {
  const { params, setFilter, clearFilters } = useFilters<ProductParamsTypes>();

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const { data: categories } = useFetchProductCategories();
  const { data: brands } = useFetchProductBrands();

  return (
    <div className="product__filter ">
      {/* only show on desktop */}
      <h5 className="mb-4 d-none d-lg-block">
        <i className="fa-solid fa-filter"></i> Filter
      </h5>

      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Category</Accordion.Header>
          <Accordion.Body>
            <ul className="list-unstyled mb-0">
              {categories?.map((category) => (
                <li className="mb-2" key={`category-${category.id}`}>
                  <span
                    role="button"
                    className={
                      category.id == params.category_id
                        ? "text-primary fw-bold"
                        : "text-dark"
                    }
                    onClick={() => setFilter("category_id", category.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {category.name}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="1" flush alwaysOpen>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Brand</Accordion.Header>
          <Accordion.Body>
            <ul className="list-unstyled mb-0">
              {brands?.map((brand) => (
                <li className="mb-2" key={`brand-${brand.id}`}>
                  <span
                    role="button"
                    className={
                      brand.id == params.brand_id
                        ? "text-primary fw-bold"
                        : "text-dark"
                    }
                    onClick={() => setFilter("brand_id", brand.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {brand.name}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="2" flush alwaysOpen>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Price Range</Accordion.Header>
          <Accordion.Body>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Min"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
              />

              <span className="input-group-text">&mdash;</span>

              <input
                type="text"
                className="form-control"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))
                }
              />
            </div>

            <div className="d-grid">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setFilter("min_price", minPrice);
                  setFilter("max_price", maxPrice);
                }}
              >
                Apply
              </button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="3" flush alwaysOpen>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Gender</Accordion.Header>
          <Accordion.Body>
            {Object.keys(SEXS).map((sex) => (
              <div className="form-check mb-2" key={`sex-${sex}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={sex}
                  id={sex}
                  checked={Number(sex) == params.sex}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilter("sex", e.target.value);
                    } else {
                      clearFilters("sex");
                    }
                  }}
                />
                <label className="form-check-label" htmlFor={sex}>
                  {SEXS[Number(sex)]}
                </label>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-grid mt-4">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            clearFilters(
              "category_id",
              "brand_id",
              "min_price",
              "max_price",
              "sex"
            );

            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

export default ProductListFilters;
