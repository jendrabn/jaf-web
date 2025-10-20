import { useFetchLanding } from "@/hooks/api/landing";
import ProductItem from "@/components/parts/ProductItem";
import BlogItem from "@/components/parts/BlogItem";
import type { ProductItemTypes } from "@/types/product";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/layouts/Layout";
import OurServices from "@/components/parts/OurServices";
import OurMarketplace from "@/components/parts/OurMarketplace";
import { Helmet } from "react-helmet";
import { env } from "@/utils/config";
import BannerSlider from "./BannerSlider";

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
            <BannerSlider banners={landing.banners} />
          </div>
        </section>
      )}

      <section className="mt-4 mt-lg-5">
        <div className="container">
          <h2 className="section-title h3">New Arrivals</h2>

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
          <img
            src="/images/outlets.jpg"
            alt="Our Outlets"
            className="img-fluid"
          />
        </div>
      </section>

      <section className="mt-4 mt-lg-5">
        <div className="container">
          <h2 className="section-title h3">Our Services</h2>
          <OurServices />
        </div>
      </section>

      <section className="mt-4 mt-lg-5 mb-4 mb-lg-5">
        <div className="container">
          <h2 className="section-title h3">New Blogs</h2>

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

      <section className="mt-4 mt-lg-5 mb-5 our-marketplace">
        <div className="container">
          <h2 className="section-title h3">Marketplace Kami</h2>
          <OurMarketplace />
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
