import { useState } from "react";
import { Button } from "react-bootstrap";

interface QuantityInputProps {
  width?: number;
  size?: "sm" | "lg";
  initialValue?: number;
  maxValue?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

function QuantityInput({
  width = 50,
  size,
  initialValue = 1,
  maxValue,
  onChange,
  disabled = false,
}: QuantityInputProps) {
  const [quantity, setQuantity] = useState<number>(initialValue);

  const handleChange = (value: number) => {
    if (!isNaN(value) && maxValue && value <= maxValue) setQuantity(value);

    onChange(value);
  };

  return (
    <div
      className={`input-group d-inline-flex w-auto ${
        size ? `input-group-${size}` : ""
      }`}
    >
      <Button
        variant="outline-secondary"
        className="rounded-0"
        type="button"
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= 1 || disabled}
      >
        <i className="fa-solid fa-minus"></i>
      </Button>
      <input
        type="text"
        className="form-control text-center rounded-0"
        value={quantity}
        style={{ width }}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
      />
      <Button
        variant="outline-secondary"
        className="rounded-0"
        type="button"
        onClick={() => handleChange(quantity + 1)}
        disabled={(maxValue && quantity >= maxValue) || disabled}
      >
        <i className="fa-solid fa-plus"></i>
      </Button>
    </div>
  );
}

export default QuantityInput;
