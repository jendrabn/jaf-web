import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router";
import type { BannerTypes } from "@/types/banner";

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
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

function PrevArrow({ className, style, onClick }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label="Previous"
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
}

function NextArrow({ className, style, onClick }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label="Next"
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
}

const BannerSlider = ({ banners }: { banners: BannerTypes[] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true, // keep a stable container height
    lazyLoad: "progressive" as const, // avoid layout jumps on slow image loads
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // Hide dots on widths < 992px, keep arrows behavior controlled via CSS
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="banner-slider-container position-relative rounded-4 overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={`banner-${banner.id}`} className="banner-slide">
            <Link to={banner.url} aria-label={banner.image_description}>
              <img
                src={banner.image}
                alt={banner.image_description}
                className="w-100 h-100 object-fit-cover"
                style={{ objectPosition: "center" }}
                loading="lazy"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
