function ProductImagesCarousel({ images }: { images: string[] }) {
  return (
    <div
      id="productImageCarousel"
      className="carousel slide product__image-carousel"
    >
      <div className="position-relative">
        <div className="carousel-inner">
          {images.map((image: string, index: number) => (
            <div
              key={index}
              className={`carousel-item bg-dark bg-gradient text-center ${
                index === 0 ? "active" : ""
              }`}
            >
              <img
                src={image}
                alt={`Product Image`}
                className="h-100 w-auto object-fit-contain"
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#productImageCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#productImageCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="carousel-indicators position-static justify-content-center mt-2">
        <ul className="d-flex list-unstyled m-0">
          {images.map((image: string, index: number) => (
            <li
              className={`position-relative  ${index === 0 ? "active" : ""}`}
              key={image}
              data-bs-target="#productImageCarousel"
              data-bs-slide-to={index}
            >
              <img src={image} alt={`Product Image ${index + 1}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductImagesCarousel;
