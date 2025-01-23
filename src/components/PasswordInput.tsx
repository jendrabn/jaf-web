import { useState } from "react";
import { InputGroup, Form } from "react-bootstrap";

interface PasswordInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  className?: string;
  label?: string;
  name?: string;
}

function PasswordInput({
  value,
  onChange,
  autofocus = false,
  className,
  label = "Password",
  name = "password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Form.Group className={`${className}`}>
      <Form.Label>{label}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoFocus={autofocus}
          className="border-end-0"
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
    </Form.Group>
  );
}

export default PasswordInput;
