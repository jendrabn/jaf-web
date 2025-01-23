import { Col, Form, InputGroup, Row } from "react-bootstrap";
import AccountLayout from "../../layouts/AccountLayout";
import useForm from "../../hooks/useForm";
import { PasswordReqTypes } from "../../types/user";
import { useMutation } from "@tanstack/react-query";
import User, { useUpdatePassword } from "../../services/api/user";
import { toast } from "react-toastify";
import { useState } from "react";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";

function ChangePassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { values, resetForm, handleChange, handleSubmit } =
    useForm<PasswordReqTypes>({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  // const { mutate, isPending, error, reset } = useMutation({
  //   mutationFn: (data: PasswordReqTypes) => User.updatePassword(data),
  //   onSuccess() {
  //     toast.success("Password changed successfully.");

  //     resetForm();
  //   },
  // });

  const { mutate, isPending, error, reset } = useUpdatePassword();

  return (
    <AccountLayout title="Change Password" description="Change your password">
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
              New Password
            </Form.Label>
            <Col sm={9}>
              <InputGroup hasValidation>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                <InputGroup.Text
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    }`}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" as={Row}>
            <Form.Label column sm={3} className="text-gray-700">
              Confirm New Password
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password_confirmation"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={3}></Form.Label>
            <Col sm={9}>
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-floppy-disk me-2"></i>Change Password
              </button>
            </Col>
          </Form.Group>
        </fieldset>
      </Form>
    </AccountLayout>
  );
}

export default ChangePassword;
