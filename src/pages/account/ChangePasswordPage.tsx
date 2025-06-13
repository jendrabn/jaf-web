import { Button, Col, Form, Row } from "react-bootstrap";
import AccountLayout from "../../layouts/AccountLayout";
import useForm from "../../hooks/useForm";
import type { PasswordReqTypes } from "../../types/user";
import { useUpdatePassword } from "../../services/api/user";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import PasswordInput from "../../components/PasswordInput";

function ChangePassword() {
  const { values, handleChange, handleSubmit } = useForm<PasswordReqTypes>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const { mutate, isPending, error, reset } = useUpdatePassword();

  return (
    <AccountLayout title="Change Password" description="Change your password">
      <div className="row">
        <div className="col-lg-9">
          <ErrorValidationAlert error={error} onClose={reset} />
          <Form onSubmit={handleSubmit(() => mutate(values))}>
            <fieldset disabled={isPending}>
              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Current Password
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="password"
                    name="current_password"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Password
                </Form.Label>
                <Col sm={9}>
                  <PasswordInput
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label column sm={3} className="text-gray-700">
                  Confirm Password
                </Form.Label>
                <Col sm={9}>
                  <PasswordInput
                    name="password_confirmation"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={3} />
                <Col sm={9}>
                  <Button type="submit" variant="primary">
                    Change Password
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
