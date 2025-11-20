import { Breadcrumb, Button, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import { getGenderLabel, formatCurrency } from "@/utils/functions";
import ProductItem from "@/components/parts/ProductItem";
import { useState } from "react";
import { useCreateCart } from "@/hooks/api/cart";
import Layout from "@/components/layouts/Layout";
import NotFoundPage from "@/pages/NotFound";
import { useFetchProduct, useFetchRelatedProducts } from "@/hooks/api/product";
import { useCreateWishlist } from "@/hooks/api/wishlist";
import Loading from "@/components/ui/Loading";
import QuantityInput from "@/components/ui/QuantityInput";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import StarRating from "@/components/ui/StarRating";
import { Helmet } from "react-helmet";
import { env } from "@/utils/config";
import ProductImageSlider from "./ProductImageSlider";
import ShareModal from "@/components/parts/ShareModal";
import CountdownBlocks from "@/components/ui/CountdownBlocks";
import { getProductPricingInfo } from "@/utils/pricing";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [showShareModal, setShowShareModal] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useFetchProduct(slug);
  const { data: relatedProducts } = useFetchRelatedProducts(slug);

  const cartMutation = useCreateCart();
  const createWishlistMutation = useCreateWishlist();

  const handleQuantityChange = (quantity: number) => setQuantity(quantity);

  const handleAddToCart = () => {
    if (!product?.id) return;

    cartMutation.mutate(
      {
        product_id: product.id,
        quantity,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["carts"] });

          toast.success("Berhasil ditambahkan ke keranjang.");
        },
      }
    );
  };

  const handleAddToWishlist = () => {
    if (!product?.id) return;

    createWishlistMutation.mutate(
      { product_id: product.id },
      {
        onSuccess() {
          toast.success("Berhasil ditambahkan ke wishlist.");

          queryClient.invalidateQueries({ queryKey: ["wishlists"] });
        },
      }
    );
  };

  const pricingInfo = product ? getProductPricingInfo(product) : null;
  const priceToDisplay = pricingInfo?.currentPrice ?? product?.price ?? 0;
  const showStrikeThrough =
    Boolean(pricingInfo?.strikeThroughPrice) &&
    pricingInfo?.strikeThroughPrice !== priceToDisplay;
  const discountLabel =
    pricingInfo?.discountPercent && pricingInfo.discountPercent > 0
      ? `-${pricingInfo.discountPercent}%`
      : null;
  const isFlashSaleRunning = Boolean(pricingInfo?.isFlashSale);

  if (!isLoading && !product) return <NotFoundPage />;

  return (
    <Layout>
      {isLoading && <Loading className="py-5" />}

      {!isLoading && product && (
        <>
          <Helmet>
            <title>
              {product.name} | {env.APP_NAME}
            </title>
          </Helmet>

          <div className="container">
            {/* Breadcrumb */}
            <Breadcrumb>
              <Breadcrumb.Item href="/">
                <i className="bi bi-house-door-fill"></i>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/products">Produk</Breadcrumb.Item>
              <Breadcrumb.Item
                href={`/products?category_id=${product.category.id}`}
              >
                {product.category.name}
              </Breadcrumb.Item>
              <Breadcrumb.Item active className="text-truncate">
                {product.name}
              </Breadcrumb.Item>
            </Breadcrumb>

            {/* Product info */}
            <section className="row mt-5 gx-lg-5">
              <div className="col-lg-6">
                <ProductImageSlider images={product.images} />
              </div>
              <div className="col-lg-6 mt-3 mt-lg-0">
                {/* Product Name */}
                <h1 className="lh-sm h2">{product?.name}</h1>

                {/* Product Meta */}
                <div className="d-flex align-items-center fs-6 mt-3">
                  <div className="px-3 ps-0 border-end border-2">
                    <span className="me-2 text-decoration-underline">
                      {product?.rating_avg}
                    </span>
                    <span>
                      <StarRating rate={product?.rating_avg} />
                    </span>
                  </div>
                  <div className="px-3 border-end border-2">
                    <span className="me-2 text-decoration-underline">
                      {product?.ratings.length}
                    </span>
                    <span className="text-muted small">Penilaian</span>
                  </div>
                  <div className="px-3">
                    <span className="me-2 text-decoration-underline">
                      {product?.sold_count}
                    </span>
                    <span className="text-muted small">Terjual</span>
                  </div>
                  <div className="px-3">
                    <Button
                      variant="link"
                      className="p-0 link-body-emphasis"
                      onClick={() => setShowShareModal(true)}
                    >
                      <i className="bi bi-share"></i>
                    </Button>
                    <ShareModal
                      show={showShareModal}
                      onHide={() => setShowShareModal(false)}
                      data={{
                        title: product?.name,
                        url: window.location.href,
                      }}
                    />
                  </div>
                </div>

                {/* Product Price */}
                {isFlashSaleRunning && (
                  <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                    <span className="badge bg-primary d-inline-flex align-items-center gap-1">
                      <i className="bi bi-lightning-charge-fill"></i> Flash Sale
                    </span>
                    {product.flash_sale_end_at && (
                      <CountdownBlocks
                        targetDate={product.flash_sale_end_at}
                        size="sm"
                      />
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fs-2 fw-bold text-danger">
                      {formatCurrency(priceToDisplay)}
                    </span>
                    {showStrikeThrough && (
                      <div className="fs-6 text-muted">
                        (
                        <span className="text-decoration-line-through text-muted">
                          {formatCurrency(
                            pricingInfo?.strikeThroughPrice ?? product?.price ?? 0
                          )}
                        </span>
                        {discountLabel && (
                          <span className="ms-2">{discountLabel}</span>
                        )}
                        )
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-3">
                  <div className="d-flex flex-column gap-4">
                    <div className="row">
                      <div className="col-md-3 col-4 fw-semibold text-muted">
                        Kategori
                      </div>
                      <div className="col-md-9 col-6">
                        {product?.category?.name ?? "-"}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3 col-4 fw-semibold text-muted">
                        Brand
                      </div>
                      <div className="col-md-9 col-6">
                        {product?.brand?.name ?? "-"}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3 col-4 fw-semibold text-muted">
                        Gender
                      </div>
                      <div className="col-md-9 col-6">
                        {getGenderLabel(product?.sex) || "-"}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3 col-4 fw-semibold text-muted">
                        SKU
                      </div>
                      <div className="col-md-9 col-6">
                        {product?.sku || "-"}
                      </div>
                    </div>

                    <div className="row align-items-center">
                      <div className="col-md-3 col-4 fw-semibold text-muted mb-2 mb-md-0">
                        Jumlah
                      </div>
                      <div className="col-md-9 col-6">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                          <QuantityInput
                            onChange={handleQuantityChange}
                            size="sm"
                            maxValue={product?.stock}
                          />

                          <span className="text-muted small d-none d-md-block">
                            {product?.stock > 0 ? "TERSEDIA" : "HABIS"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-row gap-2 mt-4">
                    <Button
                      variant="primary"
                      className="py-2 px-5 flex-fill flex-md-grow-0"
                      disabled={cartMutation.isPending || product?.stock <= 0}
                      onClick={handleAddToCart}
                      title="Tambah ke Keranjang"
                    >
                      <i className="bi bi-cart-plus me-2"></i> Tambah ke
                      Keranjang
                    </Button>

                    <Button
                      variant="outline-primary"
                      className="py-2 px-3"
                      onClick={handleAddToWishlist}
                      title="Tambah ke Wishlist"
                      disabled={createWishlistMutation.isPending}
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Product Description & Reviews */}
            <section className="mt-5">
              <h2 id="product-details-tabs">Detail Produk</h2>

              <Tabs defaultActiveKey={"description"}>
                <Tab
                  eventKey="description"
                  title="Deskripsi"
                  dangerouslySetInnerHTML={{
                    __html: product?.description || "",
                  }}
                  className="p-3 border text-break"
                ></Tab>
                <Tab
                  eventKey="reviews"
                  title="Ulasan"
                  className="p-3 border text-break"
                >
                  {product?.ratings && product.ratings.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {product.ratings.map((rating, idx) => (
                        <div
                          className="list-group-item py-3 px-0 border-0 border-bottom"
                          key={rating.order_item_id || idx}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: 44,
                                height: 44,
                                fontWeight: 600,
                                fontSize: 18,
                                textTransform: "uppercase",
                              }}
                            >
                              {rating.is_anonymous
                                ? "A"
                                : rating.username?.charAt(0) || "U"}
                            </div>
                            <div>
                              <div className="fw-semibold">
                                {rating.username}
                              </div>
                              <div>
                                <StarRating rate={rating.rating} />
                              </div>
                              <div className="text-muted small">
                                {new Date(rating.created_at)
                                  .toLocaleString("sv-SE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    timeZone: "Asia/Jakarta",
                                  })
                                  .replace(",", "")
                                  .replace(/\./g, ":")
                                  .slice(0, 16)}
                              </div>
                              <div className="mb-1">
                                {rating.comment || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      Belum ada ulasan untuk produk ini.
                    </div>
                  )}
                </Tab>
              </Tabs>
            </section>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <section className="mt-5">
                <h2 className="section-title h3">Produk Terkait</h2>

                <div className="row g-3">
                  {relatedProducts.map((product) => (
                    <div
                      className="col-6 col-md-3 col-lg-2"
                      key={`product-${product.id}`}
                    >
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
