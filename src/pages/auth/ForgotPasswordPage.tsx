import { Button, Form } from "react-bootstrap";
import AuthLayout from "../../layouts/AuthLayout";
import { useForgotPassword } from "../../services/api/auth";
import useForm from "../../hooks/useForm";
import type { ForgotPasswordReqTypes } from "../../types/auth";
import { toast } from "react-toastify";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import type { FormEvent } from "react";

function ForgotPasswordPage() {
  const { mutate, isPending, error, reset } = useForgotPassword();

  const { values, resetForm, handleChange } = useForm<ForgotPasswordReqTypes>({
    email: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(values, {
      onSuccess() {
        toast.success("Reset password link sent to your email.");

        resetForm();
      },
    });
  };

  return (
    <AuthLayout title="Forgot Password">
      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              value={values.email}
              autoFocus
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Send Reset Password Link
            </Button>
          </div>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
