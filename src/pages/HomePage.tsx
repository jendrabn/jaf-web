import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useFetchLanding } from "../services/api/landing";
import ProductItem from "../components/ProductItem";
import BlogItem from "../components/BlogItem";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import type { ProductItemTypes } from "../types/product";
import Loading from "../components/Loading";

function HomePage() {
  const { data: landing, isLoading } = useFetchLanding();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Navbar />

      <main>
        {landing?.banners && landing?.banners.length > 0 && (
          <section className="mt-0 mt-md-4 mt-lg-5">
            <div className="container-lg">
              <div
                id="bannerCarousel"
                className="carousel slide banner__carousel-wrapper"
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
                    <i className="fa-solid fa-chevron-left"></i>
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
                    <i className="fa-solid fa-chevron-right"></i>
                  </span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 mt-lg-5">
          <div className="container">
            <h2 className="section__title">New Arrivals</h2>

            {isLoading && <Loading className="py-5" />}

            {landing?.products.length === 0 && (
              <p className="text-center text-gray-700 py-5">
                No products found
              </p>
            )}

            {landing?.products && landing?.products.length > 0 && (
              <div className="row g-3">
                {landing.products.map((product: ProductItemTypes) => (
                  <div className="col-6 col-md-3 col-lg-2" key={product.id}>
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-4 mt-lg-5 mb-4 mb-lg-5">
          <div className="container">
            <h2 className="section__title">New Blogs</h2>

            {isLoading && <Loading className="py-5" />}

            {landing?.blogs.length === 0 && (
              <p className="text-center text-gray-700 py-5">No blogs found</p>
            )}

            {landing?.blogs && landing?.blogs.length > 0 && (
              <div className="row g-3">
                {landing.blogs.slice(0, 4).map((blog) => (
                  <div className="col-6 col-md-3 col-lg-3" key={blog.id}>
                    <BlogItem blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
