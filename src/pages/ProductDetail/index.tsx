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
import ProductImagesCarousel from "./ProductImagesCarousel";
import StarRating from "@/components/ui/StarRating";
import NoData from "@/components/ui/NoData";
import { Helmet } from "react-helmet-async";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useFetchProduct(productId);
  const { data: relatedProducts } = useFetchRelatedProducts(productId);

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

  const isDiscounted = !!(
    product?.is_discounted && product?.price_after_discount != null
  );

  const originalPrice = product?.price ?? 0;

  const discountedPrice = product?.price_after_discount ?? originalPrice;

  const discountPercent =
    typeof product?.discount_in_percent === "number"
      ? Math.max(Math.round(product.discount_in_percent), 0)
      : originalPrice > 0 && discountedPrice < originalPrice
      ? Math.max(
          Math.round(((originalPrice - discountedPrice) / originalPrice) * 100),
          0
        )
      : null;

  const discountLabel =
    discountPercent && discountPercent > 0 ? `-${discountPercent}%` : null;

  const hasDiscountLabel = !!discountLabel;

  if (!isLoading && !product) return <NotFoundPage />;

  return (
    <Layout>
      {isLoading && <Loading className="py-5" />}

      {!isLoading && product && (
        <>
          <Helmet>
            <title>
              {product?.name} | {import.meta.env.VITE_APP_NAME}
            </title>
          </Helmet>

          <div className="container">
            <Breadcrumb className="mb-5">
              <Breadcrumb.Item href="/">
                <i className="bi bi-house-door-fill"></i>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/products">Produk</Breadcrumb.Item>
              <Breadcrumb.Item
                href={`/products?category_id=${product?.category?.id}`}
              >
                {product?.category?.name}
              </Breadcrumb.Item>
              <Breadcrumb.Item active className="text-truncate">
                {product?.name}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className="row gx-5">
              <div className="col-lg-6">
                <ProductImagesCarousel images={product?.images || []} />
              </div>
              <div className="col-lg-6">
                <h1 className="lh-sm mb-3">{product?.name}</h1>

                <div className="d-flex align-items-center fs-6 mb-3">
                  <div className="px-3 ps-0 border-end border-2">
                    <span className="me-2 text-underline">
                      {product?.rating_avg}
                    </span>
                    <span>
                      <StarRating rate={product?.rating_avg} />
                    </span>
                  </div>
                  <div className="px-3 border-end border-2">
                    <span className="me-2">{product?.ratings.length}</span>
                    <span className="text-gray-600">Penilaian</span>
                  </div>
                  <div className="px-3">
                    <span className="me-2">{product?.sold_count}</span>
                    <span className="text-gray-600">Terjual</span>
                  </div>
                </div>

                <div className="product-info">
                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Harga</div>
                    <div className="col-md-9 h4 mb-0">
                      {isDiscounted ? (
                        <div className="d-flex flex-column">
                          <span>{formatCurrency(discountedPrice)}</span>
                          <div className="fs-6 text-gray-600">
                            (
                            <span className="text-decoration-line-through text-muted">
                              {formatCurrency(originalPrice)}
                            </span>
                            {hasDiscountLabel && (
                              <span className="ms-2">{discountLabel}</span>
                            )}
                            )
                          </div>
                        </div>
                      ) : (
                        formatCurrency(product?.price)
                      )}
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Kategori</div>
                    <div className="col-md-9">{product?.category?.name}</div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Brand</div>
                    <div className="col-md-9">{product?.brand?.name}</div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Gender</div>
                    <div className="col-md-9">
                      {getGenderLabel(product?.sex) || "-"}
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Jumlah</div>
                    <div className="col-md-9">
                      <QuantityInput
                        onChange={handleQuantityChange}
                        size="sm"
                        maxValue={product?.stock}
                      />
                      <span className="text-gray-700 ms-3">
                        {product?.stock} stok tersedia
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 mb-3 fs-6 fw-bold text-gray-600 align-items-center ">
                    <Button
                      variant="primary"
                      className="py-2 px-5 flex-grow-1 flex-md-grow-0"
                      disabled={cartMutation.isPending}
                      onClick={handleAddToCart}
                    >
                      <i className="bi bi-cart-plus me-2"></i> Tambah ke
                      Keranjang
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="py-2"
                      onClick={handleAddToWishlist}
                      disabled={createWishlistMutation.isPending}
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
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
                                    .replace(",", "") // hilangkan koma
                                    .replace(/\./g, ":") // ganti titik menjadi titik dua pada jam
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
              </div>
            </div>

            <section className="mt-5">
              <h2 className="section-title">Produk Terkait</h2>

              {relatedProducts?.length === 0 && <NoData />}

              {relatedProducts && relatedProducts.length > 0 && (
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
              )}
            </section>
          </div>
        </>
      )}
    </Layout>
  );
}
