import ProductItem from "@/components/parts/ProductItem";
import CountdownBlocks from "@/components/ui/CountdownBlocks";
import Loading from "@/components/ui/Loading";
import { useFetchFlashSales } from "@/hooks/api/flash-sale";
import type { FlashSaleScheduleTypes } from "@/types/flash-sale";
import type { CSSProperties } from "react";
import Slider, { type Settings } from "react-slick";
import { Link } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FlashSaleSection.scss";

type ArrowProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

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

const PrevArrow = ({ className, style, onClick }: ArrowProps) => (
  <button
    type="button"
    aria-label="Produk flash sale sebelumnya"
    className={className}
    onClick={onClick}
    style={{
      ...style,
      border: "none",
      background: "transparent",
      cursor: "pointer",
    }}
  >
    <span style={circleStyle}>
      <i className="bi bi-chevron-left"></i>
    </span>
  </button>
);

const NextArrow = ({ className, style, onClick }: ArrowProps) => (
  <button
    type="button"
    aria-label="Produk flash sale berikutnya"
    className={className}
    onClick={onClick}
    style={{
      ...style,
      border: "none",
      background: "transparent",
      cursor: "pointer",
    }}
  >
    <span style={circleStyle}>
      <i className="bi bi-chevron-right"></i>
    </span>
  </button>
);

const getRunningFlashSale = (flashSales?: FlashSaleScheduleTypes[]) =>
  flashSales?.find((sale) => sale.status === "running");

const FlashSaleSection = () => {
  const { data, isLoading } = useFetchFlashSales();
  const flashSales = data || [];
  const runningFlashSale = getRunningFlashSale(flashSales);
  const products = runningFlashSale?.products || [];

  if (!isLoading && (!runningFlashSale || products.length === 0)) {
    return null;
  }

  const sliderSettings: Settings = {
    dots: false,
    arrows: true,
    infinite: products.length > 6,
    speed: 400,
    swipeToSlide: true,
    slidesToShow: Math.min(6, products.length),
    slidesToScroll: 2,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200, // <= 1200px
        settings: {
          slidesToShow: Math.min(4, products.length),
        },
      },
      {
        breakpoint: 992, // <= 992px
        settings: {
          slidesToShow: Math.min(3, products.length),
        },
      },
      {
        breakpoint: 768, // <= 768px
        settings: {
          slidesToShow: Math.min(2, products.length),
        },
      },
      {
        breakpoint: 576, // <= 576px
        settings: {
          slidesToShow: Math.min(2, products.length),
        },
      },
    ],
  };

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
          <div className="flash-sale-slider-wrapper">
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div className="flash-sale-slide" key={product.id}>
                  <ProductItem
                    product={product}
                    showRating={false}
                    flashSaleStatus="running"
                    hideZeroSoldCount
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSaleSection;
