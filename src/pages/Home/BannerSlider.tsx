import type { BannerTypes } from "@/types/banner";

const BannerSlider = ({ banners }: { banners: BannerTypes[] }) => {
  return (
    <div id="bannerCarousel" className="carousel slide banner-carousel-wrapper">
      <div className="carousel-indicators">
        {banners.map((banner, index: number) => (
          <button
            key={`indicator-${banner.id}`}
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {banners.map((banner, index: number) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={`banner-${banner.id}`}
          >
            <img
              src={banner.image}
              className="d-block w-100 h-100 object-fit-fill"
              alt={banner.image_description}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="prev"
      >
        <span className="control__prev-icon">
          <i className="bi bi-chevron-left"></i>
        </span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="next"
      >
        <span className="control__next-icon">
          <i className="bi bi-chevron-right"></i>
        </span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
export default BannerSlider;
