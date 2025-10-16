import { Image } from "react-bootstrap";

interface ProductImageProps {
  url: string;
  alt?: string;
  className?: string;
  width?: number;
}

const ProductImage = (props: ProductImageProps) => {
  const { url, alt, className, width = 50 } = props;

  return (
    <div
      className={`d-inline-block bg-gray-300 border m-0 ${className}`}
      style={{ width, height: width, aspectRatio: "1/1" }}
    >
      <Image
        src={url}
        alt={alt}
        className="d-inline-block w-100 h-100 object-fit-fill"
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;
