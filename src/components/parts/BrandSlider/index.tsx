import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import type { ProductBrandTypes } from "@/types/product";
import { Card } from "react-bootstrap";
import { Link } from "react-router";

const circleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6C757D",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

type ArrowButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
};

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous brand" : "Next brand"}
      className={`brand-arrow brand-arrow-${direction}`}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        zIndex: 10,
        transform:
          direction === "prev"
            ? "translate(-50%, -50%)"
            : "translate(50%, -50%)",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        ...(direction === "prev" ? { left: 0 } : { right: 0 }),
      }}
    >
      <span style={circleStyle}>
        <i
          className={
            direction === "prev" ? "bi bi-chevron-left" : "bi bi-chevron-right"
          }
        ></i>
      </span>
    </button>
  );
}

const BrandSlider = ({ brands }: { brands: ProductBrandTypes[] }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="brand-swiper-wrapper position-relative">
      <ArrowButton
        direction="prev"
        onClick={() => swiperRef.current?.slidePrev()}
      />
      <ArrowButton
        direction="next"
        onClick={() => swiperRef.current?.slideNext()}
      />

      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        loop={true}
        speed={400}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={4}
        spaceBetween={20}
        breakpoints={{
          1400: { slidesPerView: 4 },
          1200: { slidesPerView: 3 },
          992: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          576: { slidesPerView: 2 },
          0: { slidesPerView: 2 },
        }}
        navigation={false}
        className="brand-swiper"
      >
        {brands.map((brand) => (
          <SwiperSlide
            key={`brand-${brand.id ?? brand.name}`}
            className="brand-slide"
          >
            <Link
              to={`/products?brand_id=${brand.id}`}
              className="brand-link d-block"
              aria-label={`Lihat produk brand ${brand.name}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card className="brand-card" body>
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="brand-logo img-fluid"
                    loading="lazy"
                  />
                ) : (
                  <div className="brand-title line-clamp-1" title={brand.name}>
                    {brand.name}
                  </div>
                )}
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandSlider;
