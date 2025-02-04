import { useFetchProducts } from "../services/api/product";
import { ProductItemTypes, ProductParamsTypes } from "../types/product";
import ProductItem from "../components/ProductItem";
import ProductListFilters from "../components/ProductListFilters";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import useFilters from "../hooks/useFilters";
import Layout from "../layouts/Layout";
import { Button, Offcanvas } from "react-bootstrap";
import { useState } from "react";

function ProductPage() {
  const { params, queryString, setFilter, clearFilters } =
    useFilters<ProductParamsTypes>();

  const { data: products, isLoading } = useFetchProducts(queryString);

  const [showFilters, setShowFilters] = useState(false);

  const handlePageClick = (page: number) => {
    setFilter("page", page);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout title="Products">
      <div className="container">
        <div className="row">
          <div className="col-lg-2 d-none d-lg-block">
            <ProductListFilters />
          </div>
          <div className="col-lg-10">
            {params.search && (
              <div className="d-flex align-items-center justify-content-start mb-3">
                <p className="text-gray-700 mb-0">
                  <i className="fa-solid fa-magnifying-glass me-2"></i>Search
                  results for "
                  <span className="fw-bold text-body">{params.search}</span>"
                </p>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="text-gray-700 mb-0 me-2">Sort by:</span>
                <select
                  className="form-select w-auto d-inline-block"
                  onChange={(e) => {
                    setFilter("sort_by", e.target.value);
                    clearFilters("page");
                  }}
                >
                  <option value="">Relevance</option>
                  <option value={"newest"}>Latest</option>
                  <option value={"oldest"}>Oldest</option>
                  <option value={"sales"}>Top Sales</option>
                  <option value={"cheapest"}>Price: low to high</option>
                  <option value={"expensive"}>Price: high to low</option>
                </select>
              </div>

              {/* only show in desktop */}
              <p className="text-gray-700 mb-0 d-none d-lg-block">
                Showing {products?.data?.length || 0} results
              </p>

              {/* only show in mobile */}
              <div className="d-block d-lg-none">
                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowFilters(true)}
                >
                  <i className="bi bi-funnel-fill"></i>
                </Button>

                <Offcanvas
                  show={showFilters}
                  onHide={() => setShowFilters(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      <i className="bi bi-funnel-fill"></i> Filters
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <ProductListFilters />
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
            </div>

            {isLoading && <Loading className="py-5" />}

            {products?.data?.length === 0 && (
              <p className="text-center text-gray-700">No products found</p>
            )}

            {products?.data && products?.data?.length > 0 && (
              <>
                <div className="row g-3">
                  {products.data.map((product: ProductItemTypes) => (
                    <div
                      className="col-6 col-sm-6 col-lg-1of5"
                      key={`product-${product.id}`}
                    >
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>

                {products?.page && (
                  <Pagination
                    {...products.page}
                    onClick={(page: number) => handlePageClick(page)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductPage;
