import { useFetchProducts } from "@/hooks/api/product";
import type { ProductItemTypes, ProductParamsTypes } from "@/types/product";
import ProductItem from "@/components/parts/ProductItem";
import ProductFilters from "./ProductFilters";
import Loading from "@/components/ui/Loading";
import Pagination from "@/components/ui/Pagination";
import useFilters from "@/hooks/useFilters";
import Layout from "@/components/layouts/Layout";
import { Button, Offcanvas, Dropdown } from "react-bootstrap";
import { useState } from "react";
import NoData from "@/components/ui/NoData";
import { Helmet } from "react-helmet";
import { env } from "@/utils/config";

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

const ProductPage = () => {
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
    <Layout>
      <Helmet>
        <title>Produk | {env.APP_NAME}</title>
        <meta
          name="description"
          content="Temukan parfum berkualitas dengan harga terjangkau. Jelajahi koleksi parfum kami yang lengkap dan nikmati penawaran menarik."
        />
      </Helmet>

      <div className="container">
        <div className="row g-5">
          <div className="col-lg-2 d-none d-lg-block">
            <ProductFilters />
          </div>
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Sort Dropdown */}
              <Dropdown>
                <Dropdown.Toggle
                  id="sort-btn-desktop"
                  variant="outline-dark"
                  aria-label="Urutkan"
                  title="Urutkan"
                >
                  Urutkan:{" "}
                  {FILTER_OPTIONS.find(
                    (o) => o.value === (params.sort_by || "")
                  )?.label || "Relevansi"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {FILTER_OPTIONS.map((option) => (
                    <Dropdown.Item
                      key={option.value}
                      active={params.sort_by === option.value}
                      onClick={() => {
                        setFilter("sort_by", option.value);
                        clearFilters("page");
                      }}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* Filter Button */}
              <Button
                variant="outline-dark"
                className="d-lg-none"
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
                  <ProductFilters />
                </Offcanvas.Body>
              </Offcanvas>

              {/* Product Count */}
              <div className="text-secondary-emphasis mb-0 d-none d-lg-block">
                {products?.page?.from || 0} - {products?.page?.to || 0} dari{" "}
                {products?.page?.total || 0} produk
              </div>
            </div>

            {/* Search Message */}
            {params.search && (
              <div className="text-body-emphasis line-clamp-1 mb-4">
                <i className="bi bi-search me-2"></i>Hasil pencarian untuk{" "}
                <span className="fw-bold text-body">{params.search}</span>
              </div>
            )}

            {/* Loading */}
            {isLoading && <Loading className="py-5" />}

            {/* No Data */}
            {products?.data?.length === 0 && (
              <NoData
                title="Belum Ada Produk"
                message="Kami belum menemukan produk untuk ditampilkan. Yuk, periksa kembali nanti!"
              />
            )}

            {/* Product List */}
            {products?.data && products?.data?.length > 0 && (
              <>
                <div className="row g-4">
                  {products.data.map((product: ProductItemTypes) => (
                    <div
                      className="col-6 col-md-4 col-lg-1of5"
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
};

export default ProductPage;
