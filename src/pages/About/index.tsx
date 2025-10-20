import { useState } from "react";
import OurServices from "@/components/parts/OurServices";
import googleReviews from "@/data/google-reviews.json";
import Layout from "@/components/layouts/Layout";
import { Helmet } from "react-helmet-async";
import StarRating from "@/components/ui/StarRating";
import { env } from "@/utils/config";

const AboutPage = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [fade, setFade] = useState(true);

  const handleReviewChange = (idx: number) => {
    if (idx === activeReview) return;
    setFade(false);
    setTimeout(() => {
      setActiveReview(idx);
      setFade(true);
    }, 200); // durasi fade out
  };

  return (
    <Layout>
      <Helmet>
        <title>Tentang Kami | {env.APP_NAME}</title>
        <meta
          name="description"
          content="Pelajari lebih lanjut tentang JAF Parfum's, layanan kami, dan komitmen kami terhadap kualitas dan kepuasan pelanggan."
        />
      </Helmet>

      <div className="container">
        <h1 className="mb-4 fw-bold text-center">Tentang JAF Parfum's</h1>

        <section className="mb-5 text-center">
          <p
            className="mx-auto text-muted fs-6"
            style={{ maxWidth: "740px", lineHeight: 1.7 }}
          >
            <span className="fw-semibold">JAF Group</span> merupakan perusahaan
            yang bergerak di bidang perdagangan parfum skala retail dan grosir
            dengan nama brand{" "}
            <span className="fw-semibold">“JAF Parfum’s”</span>. Didirikan pada{" "}
            <span className="fw-semibold">20 Juli 2009</span>, “JAF” adalah
            kepanjangan dari{" "}
            <span className="fw-semibold">“Jember Art Fragrance”</span> yang
            bertujuan dengan gagasan bisnis kreatifitas usaha, kualitas produk,
            dan SDM, serta kepuasan pelanggan dengan pelayanan prima{" "}
            <em>Customer Service Brand</em>.
          </p>
        </section>

        <section className="mb-5 d-flex justify-content-center">
          <div
            className="ratio ratio-16x9"
            style={{ maxWidth: 900, width: "100%" }}
          >
            <iframe
              src="https://www.youtube.com/embed/uW1O0s4L1pY?si=sK2rGWL8dt8VYt28"
              title="JAF Parfum's - Our First Video on YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <p
          className="text-center text-muted fs-6 mb-5"
          style={{ maxWidth: "720px", marginLeft: "auto", marginRight: "auto" }}
        >
          Kehadiran JAF Parfum’s di Jember dan di kota lainnya adalah dalam
          rangka menyediakan parfum berkualitas dengan harga terjangkau. Di
          manapun outlet JAF Parfum’s berada, kami berkomitmen untuk memberikan
          pelayanan terbaik bagi Anda, kustomer kami.
        </p>

        {/* Signature */}
        <div className="text-center mb-5">
          <div
            className="signature fw-bold fs-5"
            aria-label="Signature of Muhammad Jawad"
          >
            Muhammad Jawad
          </div>
          <div className="ceo-name text-muted">- CEO JAF Parfum's</div>
        </div>

        {/* Services Section */}
        <OurServices />

        {/* Stats Section */}
        <section className="py-5 mb-5">
          <div className="row gy-4 text-center">
            <div className="col-6 col-md-3">
              <div className="bg-white-subtle rounded-4 shadow py-4">
                <div className="number display-5 fw-bold ">50+</div>
                <div className="label text-muted">JENIS PARFUM</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white-subtle rounded-4 shadow py-4">
                <div className="number display-5 fw-bold ">19</div>
                <div className="label text-muted">
                  OUTLET DI JEMBER & SEKITARNYA
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white-subtle rounded-4 shadow py-4">
                <div className="number display-5 fw-bold ">100+</div>
                <div className="label text-muted">PRODUK BERKUALITAS</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white-subtle rounded-4 shadow py-4">
                <div className="number display-5 fw-bold ">1K+</div>
                <div className="label text-muted">PELANGGAN YANG PUAS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Business Review Section */}
        <section className="">
          <div
            className="bg-white-subtle rounded-4 shadow-sm p-4 p-md-5 mx-auto"
            style={{ maxWidth: 600 }}
          >
            <div className="mb-3 text-center">
              <div className="mb-3">
                <img
                  src="/images/google-business.webp"
                  alt="Google My Business logo"
                  style={{ height: 40, width: "auto" }}
                />
              </div>
              <p className="small text-muted">ULASAN DARI GOOGLE BUSINESS</p>
            </div>

            <div
              className={`transition-fade ${fade ? "show" : ""}`}
              style={{ transition: "opacity 0.3s" }}
            >
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: 40,
                        height: 40,
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      {googleReviews[activeReview].name.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-semibold">
                        {googleReviews[activeReview].name}
                      </div>
                      <div className="text-warning" style={{ fontSize: 16 }}>
                        <StarRating rate={googleReviews[activeReview].rating} />
                      </div>
                    </div>
                  </div>
                  <blockquote
                    className="fst-italic text-muted mb-0"
                    style={{ minHeight: 60 }}
                  >
                    “{googleReviews[activeReview].text}”
                  </blockquote>
                </div>
              </div>
            </div>
            <div
              className="d-flex justify-content-center mb-3"
              role="list"
              aria-label="Review pagination dots"
            >
              {googleReviews.map((_review, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`control__dot-review mx-1 rounded-circle border-0 p-0 ${
                    idx === activeReview ? "active" : ""
                  }`}
                  onClick={() => handleReviewChange(idx)}
                />
              ))}
            </div>
            <p className="small text-center text-muted mb-0">
              Beri kami umpan balik.
              <br />
              Sangat penting bagi kami untuk meningkatkan pengalaman Anda.
              <br />
              Terima kasih banyak atas kontribusi Anda.
            </p>
          </div>
        </section>
        {/* End Google Business Review Section */}
      </div>
    </Layout>
  );
};

export default AboutPage;
