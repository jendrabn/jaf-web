import React, { useRef, useState } from "react";
import Slider, { type Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

const circleStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.9)",
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

const ProductImageSlider = ({ images }: { images: string[] }) => {
  const sliderRef = useRef<Slider>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const settings: Settings = {
    customPaging: (index) => (
      <button type="button" className="p-0 border-0 bg-transparent">
        <img
          src={images[index]}
          alt={`Thumbnail ${index + 1}`}
          loading="lazy"
        />
      </button>
    ),
    dots: false,
    dotsClass:
      "slick-dots slick-thumb product-thumbs d-flex justify-content-center mt-3",
    infinite: (images?.length ?? 0) > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: (images?.length ?? 0) > 1,
    adaptiveHeight: false,
    lazyLoad: "progressive",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: (index: number) => setActiveIdx(index),
  };

  return (
    <div className="product-image-slider">
      <div className="slider-box position-relative rounded-3 overflow-hidden bg-body-tertiary">
        <Slider ref={sliderRef} {...settings}>
          {(images || []).map((src, idx) => (
            <div key={`image-${idx}`} className="product-image-slide">
              <div className="ratio ratio-4x3">
                <img
                  src={src}
                  alt={`Product Image ${idx + 1}`}
                  className="position-absolute top-0 start-0 w-100 h-100 object-fit-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {(images?.length ?? 0) > 0 && (
        <div className="product-image-thumbs d-none d-lg-block mt-3">
          <ul className="d-flex justify-content-center list-unstyled gap-2 m-0">
            {images.map((src, idx) => (
              <li
                key={`thumb-${idx}-${src}`}
                className={`thumb-item ${activeIdx === idx ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="btn p-0 border-0 bg-transparent w-100 h-100"
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => sliderRef.current?.slickGoTo(idx)}
                >
                  <img src={src} alt={`Thumbnail ${idx + 1}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
