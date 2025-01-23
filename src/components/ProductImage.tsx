interface ProductImageProps {
  url: string;
  alt?: string;
  className?: string;
  width?: number;
}

function ProductImage({ url, alt, className, width = 50 }: ProductImageProps) {
  return (
    <figure
      className={`d-inline-block bg-gray-300 border m-0 ${className}`}
      style={{ width, aspectRatio: "1/1" }}
    >
      <img
        src={url}
        alt={alt}
        className="d-inline-block w-100 h-100 object-fit-contain"
        loading="lazy"
      />
    </figure>
  );
}

export default ProductImage;
