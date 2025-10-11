import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import type { RegisterReqTypes } from "../../../types/auth";
import { useRegister } from "../../../hooks/api/auth";
import AuthLayout from "../../../components/layout/AuthLayout";
import ErrorValidationAlert from "../../../components/ui/ErrorValidationAlert";
import PasswordInput from "../../../components/ui/PasswordInput";
import { Helmet } from "react-helmet-async";
import { useForm, type SubmitHandler } from "react-hook-form";

function RegisterPage() {
  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useRegister();

  const { register, handleSubmit } = useForm<RegisterReqTypes>();

  const onSubmit: SubmitHandler<RegisterReqTypes> = (data) => {
    mutate(data, {
      onSuccess() {
        toast.success("Registrasi berhasil, silahkan login.");

        navigate("/auth/login", { replace: true });
      },
    });
  };

  return (
    <AuthLayout title="Sign Up">
      <Helmet>
        <title>Daftar | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" {...register("name")} autoFocus />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register("email")} name="email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <PasswordInput {...register("password")} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Konfirmasi Password</Form.Label>
            <PasswordInput {...register("password_confirmation")} />
          </Form.Group>

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </div>

          <p className="mb-0 text-center">
            Sudah punya akun? <Link to="/auth/login">Login</Link>
          </p>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default RegisterPage;
