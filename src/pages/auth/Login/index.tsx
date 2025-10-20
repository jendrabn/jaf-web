import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useLogin } from "@/hooks/api/auth";
import type { LoginReqTypes } from "@/types/auth";
import ErrorValidationAlert from "@/components/ui/ErrorValidationAlert";
import { useLocation } from "react-router";
import { setAuthToken, setSelectedCartIds } from "@/utils/functions";
import PasswordInput from "@/components/ui/PasswordInput";
import { Helmet } from "react-helmet";
import { useForm, type SubmitHandler } from "react-hook-form";
import { env } from "@/utils/config";
import GoogleLoginButton from "@/components/parts/GoogleLoginButton";

function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { mutate, isPending, error, reset } = useLogin();

  const { register, handleSubmit } = useForm<LoginReqTypes>();

  const onSubmit: SubmitHandler<LoginReqTypes> = (data) => {
    mutate(data, {
      onSuccess: (resp) => {
        // OTP required: server returns otp_required, otp_expires_at, otp_sent_to
        if ((resp as { otp_required?: boolean }).otp_required) {
          if (data.email) {
            sessionStorage.setItem("pendingLoginEmail", data.email);
          }

          const { otp_expires_at, otp_sent_to } = resp as {
            otp_expires_at?: string;
            otp_sent_to?: string;
          };

          if (otp_expires_at) {
            sessionStorage.setItem("otpExpiresAt", otp_expires_at);
          }
          if (otp_sent_to) {
            sessionStorage.setItem("otpSentTo", otp_sent_to);
          }

          navigate("/auth/verify-login", {
            replace: true,
            state: { email: data.email, from: location.state?.from },
          });
          return;
        }

        const token = (resp as { auth_token?: string }).auth_token;
        if (!token) {
          return;
        }

        setAuthToken(token);
        setSelectedCartIds([]);

        navigate(location.state?.from || "/", { replace: true });

        window.location.reload();
      },
    });
  };

  return (
    <AuthLayout title="Log in">
      <Helmet>
        <title>Log in | {env.APP_NAME}</title>
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

          <div className="d-grid gap-2 mb-5">
            <Button variant="primary" type="submit">
              Log in
            </Button>
            <GoogleLoginButton />
          </div>

          <p className="text-center mb-0">
            Belum punya akun? <Link to="/auth/register">Daftar</Link>
          </p>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default LoginPage;
