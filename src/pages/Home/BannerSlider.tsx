import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router";
import type { BannerTypes } from "@/types/banner";

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hovered?: boolean;
};

const circleStyle = (hovered?: boolean): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6C757D",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  opacity: hovered ? 1 : 0,
  transition: "opacity 0.2s ease",
});

function PrevArrow({ className, style, onClick, hovered }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label="Previous"
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "block",
        border: "none",
        background: "transparent",
      }}
    >
      <span style={circleStyle(hovered)}>
        <i className="bi bi-chevron-left"></i>
      </span>
    </button>
  );
}

function NextArrow({ className, style, onClick, hovered }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label="Next"
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "block",
        border: "none",
        background: "transparent",
      }}
    >
      <span style={circleStyle(hovered)}>
        <i className="bi bi-chevron-right"></i>
      </span>
    </button>
  );
}

const BannerSlider = ({ banners }: { banners: BannerTypes[] }) => {
  const [hovered, setHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

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
    prevArrow: <PrevArrow hovered={hovered} />,
    nextArrow: <NextArrow hovered={hovered} />,
    beforeChange: (_current: number, next: number) => setActiveIdx(next),
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            margin: 0,
            padding: 0,
            display: "flex",
            gap: 2,
          }}
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <span
        style={{
          width: 10,
          height: 10,
          display: "block",
          borderRadius: "50%",
          background:
            i === activeIdx
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.45)",
        }}
      />
    ),
    // Show dots only on large screens (≥992px). Hide below lg.
    responsive: [
      {
        breakpoint: 992, // applies when width < 992px
        settings: {
          dots: false,
        },
      },
    ],
  };

  return (
    <div
      className="banner-carousel-wrapper position-relative rounded-3 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <div
            key={`banner-${banner.id}`}
            style={{ position: "relative", aspectRatio: "21 / 9" }}
          >
            <Link
              to={banner.url}
              className="d-block w-100 h-100"
              aria-label={banner.image_description}
            >
              <img
                src={banner.image}
                alt={banner.image_description}
                className="d-block w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
