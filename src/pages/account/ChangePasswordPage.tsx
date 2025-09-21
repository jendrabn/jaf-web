import { Button, Col, Form, Row } from "react-bootstrap";
import AccountLayout from "../../layouts/AccountLayout";
import type { PasswordReqTypes } from "../../types/user";
import { useUpdatePassword } from "../../services/api/user";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import PasswordInput from "../../components/PasswordInput";
import { Helmet } from "react-helmet-async";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<PasswordReqTypes>();
  const { mutate, isPending, error, reset } = useUpdatePassword();

  const onSubmit: SubmitHandler<PasswordReqTypes> = (data) => {
    mutate(data, {
      onSuccess() {
        resetForm();

        toast.success("Password updated successfully.");
      },
    });
  };

  return (
    <AccountLayout title="Ubah Password">
      <Helmet>
        <title>Ubah Password | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="row">
        <div className="col-lg-9">
          <ErrorValidationAlert error={error} onClose={reset} />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isPending}>
              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Password Saat Ini
                </Form.Label>
                <Col sm={9}>
                  <PasswordInput {...register("current_password")} />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Password
                </Form.Label>
                <Col sm={9}>
                  <PasswordInput {...register("password")} />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Konfirmasi Password
                </Form.Label>
                <Col sm={9}>
                  <PasswordInput {...register("password_confirmation")} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={3} />
                <Col sm={9}>
                  <Button type="submit" variant="primary">
                    <i className="bi bi-check2-circle me-2"></i>Ubah Password
                  </Button>
                </Col>
              </Form.Group>
            </fieldset>
          </Form>
        </div>
        <div className="col-lg-3"></div>
      </div>
    </AccountLayout>
  );
}

export default ChangePassword;
