import { useRef, type CSSProperties } from "react";
import { Link } from "react-router";

import ProductItem from "@/components/parts/ProductItem";
import CountdownBlocks from "@/components/ui/CountdownBlocks";
import Loading from "@/components/ui/Loading";
import { useFetchFlashSales } from "@/hooks/api/flash-sale";
import type { FlashSaleScheduleTypes } from "@/types/flash-sale";

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

const ArrowButton = ({ direction, onClick }: ArrowButtonProps) => {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
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
};

const getRunningFlashSale = (flashSales?: FlashSaleScheduleTypes[]) =>
  flashSales?.find((sale) => sale.status === "running");

const FlashSaleSection = () => {
  const { data, isLoading } = useFetchFlashSales();
  const swiperRef = useRef<SwiperRef | null>(null);
  const flashSales = data || [];
  const runningFlashSale = getRunningFlashSale(flashSales);
  const products = runningFlashSale?.products || [];

  if (!isLoading && (!runningFlashSale || products.length === 0)) {
    return null;
  }

  return (
    <section className="mt-5">
      <div className="container">
        <div className="flash-sale-home-header mb-3">
          <div className="d-flex flex-column gap-1">
            <span className="text-primary fw-semibold text-uppercase small flash-sale-home-label">
              Promo Terbatas
            </span>
            <div className="d-flex align-items-center flex-wrap gap-3 flash-sale-home-meta">
              <h2 className="h4 mb-0">Flash Sale Eksklusif</h2>
              {runningFlashSale?.end_at && (
                <div className="flash-sale-home-countdown">
                  <CountdownBlocks
                    targetDate={runningFlashSale.end_at}
                    size="sm"
                  />
                </div>
              )}
            </div>
            <p className="text-secondary mb-0">
              Kejar diskon tercepat sebelum waktunya habis!
            </p>
          </div>
          <Link to="/flash-sale" className="flash-sale-home-cta">
            Lihat Semua <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {isLoading && <Loading className="py-4" />}

        {!isLoading && runningFlashSale && (
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
        )}
      </div>
    </section>
  );
};

export default FlashSaleSection;
