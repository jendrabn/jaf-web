import { useState, forwardRef } from "react";
import type { FormControlProps } from "react-bootstrap";
import { InputGroup, Form } from "react-bootstrap";

interface PasswordInputProps extends FormControlProps {
  autofocus?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ autofocus = false, className, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <InputGroup>
        <Form.Control
          type={showPassword ? "text" : "password"}
          autoFocus={autofocus}
          className={`border-end-0 ${className || ""}`}
          ref={ref}
          {...rest}
        />
        <InputGroup.Text
          className="cursor-pointer border-start-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
          ></i>
        </InputGroup.Text>
      </InputGroup>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
