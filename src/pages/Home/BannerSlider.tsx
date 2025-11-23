import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Link } from "react-router";
import type { BannerTypes } from "@/types/banner";

type ArrowButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
};

const circleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6C757D",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      className={`banner-arrow banner-arrow-${direction}`}
      style={{
        position: "absolute",
        top: "50%",
        zIndex: 10,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        ...(direction === "prev" ? { left: 12 } : { right: 12 }),
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

const BannerSlider = ({ banners }: { banners: BannerTypes[] }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="banner-swiper-wrapper position-relative rounded-4 overflow-hidden">
      <ArrowButton
        direction="prev"
        onClick={() => swiperRef.current?.slidePrev()}
      />
      <ArrowButton
        direction="next"
        onClick={() => swiperRef.current?.slideNext()}
      />

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        loop={true}
        speed={500}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true, // <- cukup ini
        }}
        navigation={false}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={`banner-${banner.id}`}>
            <Link to={banner.url} aria-label={banner.image_description}>
              <img
                src={banner.image}
                alt={banner.image_description}
                className="w-100 h-100 object-fit-cover"
                style={{ objectPosition: "center" }}
                loading="lazy"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
