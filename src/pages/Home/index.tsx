import { useFetchLanding } from "@/hooks/api/landing";
import ProductItem from "@/components/parts/ProductItem";
import BlogItem from "@/components/parts/BlogItem";
import type { ProductItemTypes } from "@/types/product";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/layouts/Layout";
import OurServices from "@/components/parts/OurServices";
import { Helmet } from "react-helmet-async";
import { env } from "@/utils/config";

function HomePage() {
  const { data: landing, isLoading } = useFetchLanding();

  return (
    <Layout>
      <Helmet>
        <title>
          {env.APP_NAME} | Situs Belanja Parfum Online Terlengkap & Terpercaya
        </title>
      </Helmet>

      {landing?.banners && landing?.banners.length > 0 && (
        <section className="mt-0">
          <div className="container-lg">
            <div
              id="bannerCarousel"
              className="carousel slide banner-carousel-wrapper"
            >
              <div className="carousel-indicators">
                {landing.banners.map((banner, index: number) => (
                  <button
                    key={`indicator-${banner.id}`}
                    type="button"
                    data-bs-target="#bannerCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {landing.banners.map((banner, index: number) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={`banner-${banner.id}`}
                  >
                    <img
                      src={banner.image}
                      className="d-block w-100 h-100 object-fit-fill"
                      alt={banner.image_description}
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="prev"
              >
                <span className="control__prev-icon">
                  <i className="bi bi-chevron-left"></i>
                </span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="next"
              >
                <span className="control__next-icon">
                  <i className="bi bi-chevron-right"></i>
                </span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mt-4 mt-lg-5">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>

          {isLoading && <Loading className="py-5" />}

          {landing?.products.length === 0 && (
            <p className="text-center text-gray-700 py-5">No products found</p>
          )}

          {landing?.products && landing?.products.length > 0 && (
            <div className="row g-3">
              {landing.products.map((product: ProductItemTypes) => (
                <div className="col-6 col-md-3 col-lg-2" key={product.id}>
                  <ProductItem
                    product={product}
                    showSoldCount={false}
                    showRating={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 mt-lg-5">
        <div className="container">
          <img src="/img/outlets.jpg" alt="Our Outlets" className="img-fluid" />
        </div>
      </section>

      <section className="mt-4 mt-lg-5">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <OurServices />
        </div>
      </section>

      <section className="mt-4 mt-lg-5 mb-4 mb-lg-5">
        <div className="container">
          <h2 className="section-title">New Blogs</h2>

          {isLoading && <Loading className="py-5" />}

          {landing?.blogs.length === 0 && (
            <p className="text-center text-gray-700 py-5">No blogs found</p>
          )}

          {landing?.blogs && landing?.blogs.length > 0 && (
            <div className="row g-4">
              {landing.blogs.slice(0, 4).map((blog) => (
                <div className="col-12 col-md-4 col-lg-3" key={blog.id}>
                  <BlogItem blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
