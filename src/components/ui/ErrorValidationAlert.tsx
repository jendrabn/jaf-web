import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

interface ErrorValidationAlertProps {
  error: AxiosError | Error | null;
  onClose?: () => void;
}

function ErrorValidationAlert({ error, onClose }: ErrorValidationAlertProps) {
  const [errors, setErrors] = useState<string[] | null>(null);

  useEffect(() => {
    if (isAxiosError(error)) {
      if (error.response?.status === 422) {
        setErrors(
          Object.values(error?.response?.data?.errors).flat() as string[]
        );
      } else {
        setErrors(null);
      }
    } else {
      setErrors(null);
    }
  }, [error]);

  return (
    <Alert
      variant="danger"
      className="mb-3"
      dismissible
      show={!!errors}
      onClose={onClose}
    >
      <ul className="m-0">
        {errors?.map((error) => (
          <li key={`error-${error}`}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
}

export default ErrorValidationAlert;
