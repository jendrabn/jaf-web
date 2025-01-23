import { Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import { getGenderLabel, formatToRupiah } from "../utils/functions";
import ProductItem from "../components/ProductItem";
import { useState } from "react";
import { useCreateCart } from "../services/api/cart";
import Layout from "../layouts/Layout";
import NotFoundPage from "./NotFoundPage";
import {
  useFetchProduct,
  useFetchRelatedProducts,
} from "../services/api/product";
import { useCreateWishlist } from "../services/api/wishlist";
import Loading from "../components/Loading";
import QuantityInput from "../components/QuantityInput";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

export default function ProductDetailPage() {
  const { productId } = useParams();

  const [quantity, setQuantity] = useState<number>(1);

  const { data: product, isLoading } = useFetchProduct(+productId!);
  const { data: relatedProducts, isLoading: isLoadingRelatedProducts } =
    useFetchRelatedProducts(+productId!);

  const cartMutation = useCreateCart();
  const wishlistMutation = useCreateWishlist();

  const { handleCreate: handleCreateCart } = useCart();
  const { handleCreate: handleCreateWishlist } = useWishlist();

  const handleChangeQuantity = (quantity: number) => {
    setQuantity(quantity);
  };

  if (!isLoading && !product) return <NotFoundPage />;

  return (
    <Layout title={product?.name}>
      {isLoading && <Loading className="py-5" />}

      {product && (
        <>
          <div className="container">
            <div className="row gx-5">
              <div className="col-lg-6">
                <div
                  id="productImageCarousel"
                  className="carousel slide product__image-carousel"
                >
                  <div className="position-relative">
                    <div className="carousel-inner">
                      {product?.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className={`carousel-item bg-dark bg-gradient text-center ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <picture>
                            <img
                              src={image}
                              alt={`Product Image`}
                              className="h-100 w-auto object-fit-contain"
                            />
                          </picture>
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#productImageCarousel"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#productImageCarousel"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>

                  <div className="carousel-indicators position-static justify-content-center mt-2">
                    <ul className="d-flex list-unstyled m-0">
                      {product?.images.map((image: string, index: number) => (
                        <li
                          className={`position-relative  ${
                            index === 0 ? "active" : ""
                          }`}
                          key={image}
                          data-bs-target="#productImageCarousel"
                          data-bs-slide-to={index}
                        >
                          <picture>
                            <img
                              src={image}
                              alt={`Product Image ${index + 1}`}
                            />
                          </picture>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h1 className="h2 mb-1">{product?.name}</h1>
                <div className="d-flex align-items-center fs-6 mb-3">
                  <div className="px-3 ps-0 border-end border-2">
                    <span className="me-2">5</span>
                    <small></small>
                  </div>
                  <div className="px-3 border-end border-2">
                    <span className="me-2">3333</span>
                    <small className="text-gray-600">Ratings</small>
                  </div>
                  <div className="px-3">
                    <span className="me-2">{product?.sold_count}</span>
                    <small className="text-gray-600">Sold</small>
                  </div>
                </div>
                <div>
                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Price</div>
                    <div className="col-md-9 h4 mb-0">
                      {formatToRupiah(product?.price)}
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Category</div>
                    <div className="col-md-9">{product?.category?.name}</div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Brand</div>
                    <div className="col-md-9">{product?.brand?.name}</div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Gender</div>
                    <div className="col-md-9">
                      {getGenderLabel(product?.sex)}
                    </div>
                  </div>

                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Quantity</div>
                    <div className="col-md-9">
                      <QuantityInput
                        onChange={handleChangeQuantity}
                        maxValue={product?.stock}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 mb-3 fs-6 fw-bold text-gray-600 align-items-center ">
                    <button
                      className="btn btn-primary py-2 w-100"
                      disabled={cartMutation.isPending}
                      onClick={() =>
                        handleCreateCart({ product_id: +productId!, quantity })
                      }
                    >
                      <i className="fa-solid fa-cart-plus me-1"></i> Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-primary py-2 w-100"
                      onClick={() => handleCreateWishlist(+productId!)}
                      disabled={wishlistMutation.isPending}
                    >
                      <i className="fa-solid fa-heart me-1"></i> Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Tabs defaultActiveKey={"description"}>
                  <Tab
                    eventKey="description"
                    title="Description"
                    dangerouslySetInnerHTML={{
                      __html: product?.description || "",
                    }}
                    className="p-3 border text-break"
                  ></Tab>
                  <Tab
                    eventKey="reviews"
                    title="Reviews"
                    className="p-3 border text-break"
                  ></Tab>
                </Tabs>
              </div>
            </div>

            <section className="mt-5">
              <h2 className="section__title">Related Products</h2>

              {isLoadingRelatedProducts && <Loading className="py-4" />}

              {relatedProducts?.length === 0 && (
                <p className="text-center text-gray-700 py-4">
                  No related products found
                </p>
              )}

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
