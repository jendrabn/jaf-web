import { Button, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import { getGenderLabel, formatPrice } from "../utils/functions";
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
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import ProductImagesCarousel from "../components/ProductImagesCarousel";
import StarRating from "../components/StarRating";
import NoData from "../components/NoData";

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

          toast.success("Item has been added to your shopping cart.");
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
          toast.success("Item has been added to your wishlist.");

          queryClient.invalidateQueries({ queryKey: ["wishlists"] });
        },
      }
    );
  };

  if (!isLoading && !product) return <NotFoundPage />;

  return (
    <Layout title={product?.name}>
      {isLoading && <Loading className="py-5" />}

      {!isLoading && product && (
        <>
          <div className="container">
            <div className="row gx-5">
              <div className="col-lg-6">
                <ProductImagesCarousel images={product?.images || []} />
              </div>
              <div className="col-lg-6">
                <h1 className="h2 mb-2">{product?.name}</h1>
                <div className="d-flex align-items-center fs-6 mb-3">
                  <div className="px-3 ps-0 border-end border-2">
                    <span className="me-2 text-underline">0</span>
                    <span>
                      <StarRating rate={4} />
                    </span>
                  </div>
                  <div className="px-3 border-end border-2">
                    <span className="me-2">0</span>
                    <span className="text-gray-600">Ratings</span>
                  </div>
                  <div className="px-3">
                    <span className="me-2">{product?.sold_count}</span>
                    <span className="text-gray-600">Sold</span>
                  </div>
                </div>
                <div>
                  <div className="row py-2">
                    <div className="col-md-3 fw-bold">Price</div>
                    <div className="col-md-9 h4 mb-0">
                      {formatPrice(product?.price)}
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
                        onChange={handleQuantityChange}
                        size="sm"
                        maxValue={product?.stock}
                      />
                      <span className="text-gray-700 ms-3">
                        {product?.stock} pieces available
                      </span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 mb-3 fs-6 fw-bold text-gray-600 align-items-center ">
                    <Button
                      variant="primary"
                      className="py-2 w-100"
                      disabled={cartMutation.isPending}
                      onClick={handleAddToCart}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add to Cart
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="py-2 w-100"
                      onClick={handleAddToWishlist}
                      disabled={createWishlistMutation.isPending}
                    >
                      <i className="fa-solid fa-heart"></i> Add to Wishlist
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
