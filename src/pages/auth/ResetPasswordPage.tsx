import { useNavigate, useSearchParams } from "react-router";
import AuthLayout from "../../layouts/AuthLayout";
import useForm from "../../hooks/useForm";
import { ResetPasswordReqTypes } from "../../types/auth";
import { Button, Form, FormControl } from "react-bootstrap";
import { useResetPassword } from "../../services/api/auth";
import { toast } from "react-toastify";
import { FormEvent } from "react";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import PasswordInput from "../../components/PasswordInput";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useResetPassword();

  const { values, handleChange } = useForm<ResetPasswordReqTypes>({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(values, {
      onSuccess() {
        toast.success("Password reset successfully, please login.");

        navigate("/auth/login", { replace: true });
      },
    });
  };

  return (
    <AuthLayout title="Reset Password">
      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <FormControl
              type="email"
              name="email"
              value={values.email}
              disabled
            />
          </Form.Group>

          <PasswordInput
            value={values.password}
            onChange={handleChange}
            className="mb-3"
            autofocus
          />

          <PasswordInput
            value={values.password_confirmation}
            onChange={handleChange}
            className="mb-3"
            name="password_confirmation"
            label="Confirm New Password"
          />

          <div className="d-grid">
            <Button type="submit" variant="primary">
              Reset Password
            </Button>
          </div>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
