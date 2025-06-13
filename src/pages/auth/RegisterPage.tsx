import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { RegisterReqTypes } from "../../types/auth";
import { useRegister } from "../../services/api/auth";
import AuthLayout from "../../layouts/AuthLayout";
import useForm from "../../hooks/useForm";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import PasswordInput from "../../components/PasswordInput";

function RegisterPage() {
  const navigate = useNavigate();

  const { mutate, isPending, error, reset } = useRegister();

  const { values, handleChange } = useForm<RegisterReqTypes>({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(values, {
      onSuccess() {
        toast.success("Registered successfully, please sign in.");

        navigate("/auth/login", { replace: true });
      },
    });
  };

  return (
    <AuthLayout title="Sign Up">
      <ErrorValidationAlert error={error} onClose={reset} />

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={isPending}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange}
              name="name"
              value={values.name}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={handleChange}
              value={values.email}
              name="email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <PasswordInput value={values.password} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <PasswordInput
              value={values.password_confirmation}
              onChange={handleChange}
              name="password_confirmation"
            />
          </Form.Group>

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </div>

          <p className="mb-0 text-center">
            Already have an account? <Link to="/auth/login">Login</Link>
          </p>
        </fieldset>
      </Form>
    </AuthLayout>
  );
}

export default RegisterPage;
