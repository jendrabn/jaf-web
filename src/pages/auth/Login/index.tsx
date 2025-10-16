import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { useLogin } from "../../../hooks/api/auth";
import type { LoginReqTypes } from "../../../types/auth";
import ErrorValidationAlert from "../../../components/ui/ErrorValidationAlert";
import { useLocation } from "react-router";
import { setAuthToken, setSelectedCartIds } from "../../../utils/functions";
import PasswordInput from "../../../components/ui/PasswordInput";
import { Helmet } from "react-helmet-async";
import { useForm, type SubmitHandler } from "react-hook-form";

function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { mutate, isPending, error, reset } = useLogin();

  const { register, handleSubmit } = useForm<LoginReqTypes>();

  const onSubmit: SubmitHandler<LoginReqTypes> = (data) => {
    mutate(data, {
      onSuccess({ auth_token }) {
        setAuthToken(auth_token);

        setSelectedCartIds([]);

        navigate(location.state?.from || "/", { replace: true });

        window.location.reload();
      },
    });
  };

  return (
    <AuthLayout title="Sign In">
      <Helmet>
        <title>Masuk | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email")}
              autoFocus
              autoSave="email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <PasswordInput {...register("password")} />
          </Form.Group>

          <p className="text-end mb-3">
            <Link to="/auth/forgot-password">Lupa Password?</Link>
          </p>

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </div>
          <p className="text-center mb-0">
            Belum punya akun? <Link to="/auth/register">Sign Up</Link>
          </p>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default LoginPage;
