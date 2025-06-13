import { useState } from "react";
import { InputGroup, Form } from "react-bootstrap";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  name?: string;
}

function PasswordInput({
  value,
  onChange,
  autofocus = false,
  name = "password",
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <InputGroup>
      <Form.Control
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        autoFocus={autofocus}
        className={`border-end-0 ${className}`}
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

export default PasswordInput;
