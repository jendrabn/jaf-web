import { Button, Form } from "react-bootstrap";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { useForgotPassword } from "../../../hooks/api/auth";
import type { ForgotPasswordReqTypes } from "../../../types/auth";
import { toast } from "react-toastify";
import ErrorValidationAlert from "../../../components/ui/ErrorValidationAlert";
import { Helmet } from "react-helmet-async";
import { useForm, type SubmitHandler } from "react-hook-form";

function ForgotPasswordPage() {
  const { mutate, isPending, error, reset } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<ForgotPasswordReqTypes>();

  const onSubmit: SubmitHandler<ForgotPasswordReqTypes> = (data) => {
    mutate(data, {
      onSuccess() {
        toast.success("Link reset password berhasil dikirim ke email anda.");

        resetForm();
      },
    });
  };

  return (
    <AuthLayout title="Lupa Password">
      <Helmet>
        <title>Lupa Password | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register("email")} autoFocus />
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Kirim Link Reset Password
            </Button>
          </div>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
