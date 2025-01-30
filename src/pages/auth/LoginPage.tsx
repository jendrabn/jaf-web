import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { FormEvent } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import useForm from "../../hooks/useForm";
import { useLogin } from "../../services/api/auth";
import { LoginReqTypes } from "../../types/auth";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import { useLocation } from "react-router";
import { setAuthToken, setSelectedCartIds } from "../../utils/functions";
import PasswordInput from "../../components/PasswordInput";
import { useQueryClient } from "@tanstack/react-query";

function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { mutate, isPending, error, reset } = useLogin();

  const { values, handleChange } = useForm<LoginReqTypes>({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(values, {
      onSuccess({ auth_token }) {
        setAuthToken(auth_token);

        setSelectedCartIds([]);

        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["carts"] });

        navigate(location.state?.from || "/", {
          replace: true,
          viewTransition: true,
        });
      },
    });
  };

  return (
    <AuthLayout title="Sign In">
      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              autoFocus
              autoSave="email"
            />
          </Form.Group>

          <PasswordInput value={values.password} onChange={handleChange} />

          <p className="text-end mb-3">
            <Link to="/auth/forgot-password">Forgot Password?</Link>
          </p>

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </div>
          <p className="text-center mb-0">
            Don't have an account? <Link to="/auth/register">Sign Up</Link>
          </p>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default LoginPage;
