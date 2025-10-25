import type { ProductBrandTypes } from "@/types/product";
import { Card } from "react-bootstrap";
import { Link } from "react-router";
import Slider, { type Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

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

function PrevArrow({ className, style, onClick }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label="Previous brand"
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
      aria-label="Next brand"
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

const BrandSlider = ({ brands }: { brands: ProductBrandTypes[] }) => {
  const settings: Settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 400,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    lazyLoad: "progressive",
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  return (
    <div className="brand-slider-wrapper position-relative">
      <Slider {...settings}>
        {brands.map((brand) => (
          <div key={`brand-${brand.id ?? brand.name}`} className="brand-slide">
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
                  />
                ) : (
                  <div className="brand-title line-clamp-1" title={brand.name}>
                    {brand.name}
                  </div>
                )}
              </Card>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandSlider;
