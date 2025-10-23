import { useNavigate, useSearchParams } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout";
import type { ResetPasswordReqTypes } from "@/types/auth";
import { Button, Form, FormControl } from "react-bootstrap";
import { useResetPassword } from "@/hooks/api/auth";
import { toast } from "react-toastify";
import ErrorValidationAlert from "@/components/ui/ErrorValidationAlert";
import PasswordInput from "@/components/ui/PasswordInput";
import { Helmet } from "react-helmet";
import { useForm, type SubmitHandler } from "react-hook-form";
import { env } from "@/utils/config";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useResetPassword();

  const { register, handleSubmit } = useForm<ResetPasswordReqTypes>({
    defaultValues: {
      email: searchParams.get("email") || "",
      token: searchParams.get("token") || "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordReqTypes> = (data) => {
    mutate(data, {
      onSuccess() {
        toast.success("Reset password berhasil, silahkan login.");

        navigate("/auth/login", { replace: true });
      },
    });
  };

  return (
    <AuthLayout title="Reset Password">
      <Helmet>
        <title>Reset Password | {env.APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <FormControl type="email" {...register("email")} disabled />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <PasswordInput
              {...register("password")}
              className="mb-3"
              autofocus
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Konfirmasi Password</Form.Label>
            <PasswordInput
              {...register("password_confirmation")}
              className="mb-3"
            />
          </Form.Group>

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
