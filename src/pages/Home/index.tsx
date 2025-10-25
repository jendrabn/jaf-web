import { useFetchLanding } from "@/hooks/api/landing";
import ProductItem from "@/components/parts/ProductItem";
import BlogItem from "@/components/parts/BlogItem";
import type { ProductItemTypes } from "@/types/product";
import Loading from "@/components/ui/Loading";
import OurServices from "@/components/parts/OurServices";
import OurMarketplace from "@/components/parts/OurMarketplace";
import Newsletter from "@/components/parts/Newsletter";
import { Helmet } from "react-helmet";
import { env } from "@/utils/config";
import BannerSlider from "./BannerSlider";
import Footer from "@/components/parts/Footer";
import Navbar from "@/components/parts/Navbar";
import BrandSlider from "@/components/parts/BrandSlider";
import { useFetchProductBrands } from "@/hooks/api/product";
import { Link } from "react-router";

function HomePage() {
  const { data: landing, isLoading } = useFetchLanding();
  const { data: brands } = useFetchProductBrands();

  return (
    <>
      <Helmet>
        <title>
          {env.APP_NAME} | Situs Belanja Parfum Online Terlengkap & Terpercaya
        </title>
      </Helmet>

      <Navbar />

      <main
        id="main-content"
        className="main-content mb-0"
        role="main"
        tabIndex={-1}
      >
        {/* Banner slider */}
        <section>
          <div className="container">
            <BannerSlider banners={landing?.banners || []} />
          </div>
        </section>

        {/* Brand section */}
        <section className="mt-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h2 className="h4 mb-1">Belanja Berdasarkan Brand</h2>
                <p className="text-secondary mb-0">
                  Jelajahi koleksi parfum dari brand-brand terbaik pilihan kami.
                </p>
              </div>
            </div>
            <BrandSlider brands={brands || []} />
          </div>
        </section>

        {/* New arrivals */}
        <section className="mt-5 mt-lg-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h2 className="h4 mb-1">Produk Terbaru</h2>
                <p className="text-secondary mb-0">
                  Wangi terkini untuk lengkapi gaya Anda setiap hari.
                </p>
              </div>
              <Link
                to="/products"
                className="btn btn-link d-none d-md-inline-flex"
              >
                Jelajahi Produk <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>

            {isLoading && <Loading className="py-5" />}

            {landing?.products.length === 0 && (
              <p className="text-center text-secondary py-5">
                Produk belum tersedia saat ini.
              </p>
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

            <div className="text-center mt-4 d-md-none">
              <Link to="/products" className="btn btn-outline-primary">
                Jelajahi Produk
              </Link>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mt-5">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="h4 mb-1">Kenapa Pilih JAF Parfum's ?</h2>
              <p className="text-secondary mb-0">
                Layanan istimewa untuk pengalaman belanja makin berkesan.
              </p>
            </div>
            <OurServices />
          </div>
        </section>

        {/* Outlet banner with overlay CTA */}
        <section className="mt-5">
          <div className="container">
            <div className="overflow-hidden rounded-3 position-relative">
              <img
                src="/images/outlets.jpg"
                alt="Kunjungi Outlet Resmi JAF Parfum"
                className="w-100 h-100 object-fit-cover"
                loading="lazy"
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,0))",
                }}
              />
              <div className="position-absolute bottom-0 start-0 w-100">
                <div className="p-3 p-md-4 d-flex justify-content-between align-items-end">
                  <div className="d-none d-md-block">
                    <h3
                      className="h5 mb-1 text-white"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,.6)" }}
                    >
                      Kunjungi Outlet Kami
                    </h3>
                    <p className="text-white-50 mb-0 small">
                      Coba langsung koleksi terbaik kami di toko.
                    </p>
                  </div>
                  <Link to="/contact" className="btn btn-light btn-sm">
                    Lihat Lokasi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blogs */}
        <section className="mt-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <div>
                <h2 className="h4 mb-1">Artikel Terbaru</h2>
                <p className="text-secondary mb-0">
                  Tips & inspirasi memilih parfum favorit Anda.
                </p>
              </div>
              <Link to="/blog" className="btn btn-link d-none d-md-inline-flex">
                Jelajahi Artikel <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>

            {isLoading && <Loading className="py-5" />}

            {landing?.blogs.length === 0 && (
              <p className="text-center text-secondary py-5">
                Belum ada artikel.
              </p>
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

            <div className="text-center mt-4 d-md-none">
              <Link to="/blog" className="btn btn-outline-primary">
                Baca Semua
              </Link>
            </div>
          </div>
        </section>

        {/* Marketplace */}
        <section className="mt-5">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="h4 mb-1">Belanja di Marketplace Favorit Anda</h2>
              <p className="text-secondary mb-0">
                Official store kami hadir di berbagai platform.
              </p>
            </div>
            <OurMarketplace />
          </div>
        </section>

        {/* Newsletter */}
        <section className="mt-5">
          <Newsletter />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
