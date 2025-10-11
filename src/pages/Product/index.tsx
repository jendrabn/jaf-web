import { useFetchProducts } from "../../services/api/product";
import type { ProductItemTypes, ProductParamsTypes } from "../../types/product";
import ProductItem from "../../components/shared/ProductItem";
import ProductListFilters from "./ProductListFilters";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/ui/Pagination";
import useFilters from "../../hooks/useFilters";
import Layout from "../../components/layout/Layout";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useState } from "react";
import NoData from "../../components/ui/NoData";
import { Helmet } from "react-helmet-async";

// filter options
const FILTER_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Relevansi",
    value: "",
  },
  {
    label: "Terbaru",
    value: "newest",
  },
  {
    label: "Terlama",
    value: "oldest",
  },
  {
    label: "Terlaris",
    value: "sales",
  },
  {
    label: "Harga: Rendah ke Tinggi",
    value: "cheapest",
  },
  {
    label: "Harga: Tinggi ke Rendah",
    value: "expensive",
  },
];

// sort options
const SORT_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Terbaru",
    value: "newest",
  },
  {
    label: "Terlama",
    value: "oldest",
  },
];

function ProductPage() {
  const { params, queryString, setFilter, clearFilters } =
    useFilters<ProductParamsTypes>();

  const { data: products, isLoading } = useFetchProducts(queryString);

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handlePageClick = (page: number) => {
    setFilter("page", page);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Produk | {import.meta.env.VITE_APP_NAME}</title>
        <meta name="description" content="Products" />
      </Helmet>

      <div className="container">
        <div className="row">
          <div className="col-lg-2 d-none d-lg-block">
            <ProductListFilters />
          </div>
          <div className="col-lg-10">
            {params.search && (
              <div className="d-flex align-items-center justify-content-start mb-3">
                <p className="text-gray-700 mb-0">
                  <i className="bi bi-search me-2"></i>Hasil pencarian untuk "
                  <span className="fw-bold text-body">{params.search}</span>"
                </p>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Desktop Only */}
              <div className="d-none d-lg-block">
                <span className="text-gray-700 mb-0 me-2">Urutkan:</span>
                <Form.Select
                  className="w-auto d-inline-block cursor-pointer"
                  onChange={(e) => {
                    setFilter("sort_by", e.target.value);
                    clearFilters("page");
                  }}
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
              {/* End Desktop Only */}

              <p className="text-gray-700 mb-0">
                {products?.page?.from || 0} - {products?.page?.to || 0} dari{" "}
                {products?.page?.total || 0}
              </p>

              {/* Mobile Only */}
              <div className="d-flex align-items-center gap-2 d-lg-none">
                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowSort(true)}
                >
                  <i className="bi bi-arrow-down-up"></i>
                </Button>

                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowFilters(true)}
                >
                  <i className="bi bi-funnel"></i>
                </Button>

                <Offcanvas
                  show={showFilters}
                  onHide={() => setShowFilters(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      <i className="bi bi-funnel"></i> Filter
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <ProductListFilters />
                  </Offcanvas.Body>
                </Offcanvas>

                <Offcanvas
                  show={showSort}
                  onHide={() => setShowSort(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      <i className="bi bi-arrow-down-up"></i> Urutkan
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Form.Select
                      onChange={(e) => setFilter("sort_by", e.target.value)}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
              {/* End Only Mobile */}
            </div>

            {isLoading && <Loading className="py-5" />}

            {products?.data?.length === 0 && <NoData />}

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
