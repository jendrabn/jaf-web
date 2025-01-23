import { useState } from "react";

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
      <button
        className="btn btn-outline-secondary rounded-0"
        type="button"
        onClick={() => handleChange(quantity - 1)}
        disabled={quantity <= 1 || disabled}
      >
        <i className="fa-solid fa-minus"></i>
      </button>
      <input
        type="text"
        className="form-control text-center rounded-0"
        value={quantity}
        style={{ width: `${width}px` }}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
      />
      <button
        className="btn btn-outline-secondary rounded-0"
        type="button"
        onClick={() => handleChange(quantity + 1)}
        disabled={(maxValue != undefined && quantity >= maxValue) || disabled}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}

export default QuantityInput;
