import type { ProductItemTypes } from "@/types/product";
import { useRef, type CSSProperties } from "react";
import ProductItem from "@/components/parts/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperRef } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const circleStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6C757D",
  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
};

type ArrowButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
};

interface FlashSaleSliderProps {
  products: ProductItemTypes[];
}

const ArrowButton = ({ direction, onClick }: ArrowButtonProps) => {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "25%",
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
};

const FlashSaleSlider = ({ products }: FlashSaleSliderProps) => {
  const swiperRef = useRef<SwiperRef | null>(null);

  return (
    <div className="flash-sale-swiper-wrapper position-relative">
      <ArrowButton
        direction="prev"
        onClick={() => swiperRef.current?.swiper.slidePrev()}
      />
      <ArrowButton
        direction="next"
        onClick={() => swiperRef.current?.swiper.slideNext()}
      />

      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        loop={products.length > 6}
        speed={400}
        slidesPerView={2}
        slidesPerGroup={2}
        spaceBetween={16}
        navigation={false}
        breakpoints={{
          768: { slidesPerView: 4, slidesPerGroup: 2 },
          992: { slidesPerView: 6, slidesPerGroup: 2 },
        }}
        className="flash-sale-swiper"
      >
        {products.map((product) => (
          <SwiperSlide className="flash-sale-slide" key={product.id}>
            <ProductItem
              product={product}
              showRating={false}
              flashSaleStatus="running"
              hideZeroSoldCount
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FlashSaleSlider;
