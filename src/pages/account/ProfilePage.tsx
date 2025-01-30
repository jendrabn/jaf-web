import { Row, Col, Button, Form } from "react-bootstrap";
import { useAuthState } from "../../contexts/AuthContext";
import { UserTypes } from "../../types/user";
import useForm from "../../hooks/useForm";
import AccountLayout from "../../layouts/AccountLayout";
import { useUpdateUser } from "../../services/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useRef } from "react";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";

function ProfilePage() {
  const { user } = useAuthState();

  const queryClient = useQueryClient();

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);

  const { mutate, isPending, error, reset } = useUpdateUser();

  const { values, resetForm, handleChange } = useForm<UserTypes | null>(user);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    mutate(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");

        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: () => {
        resetForm();

        avatarRef.current?.setAttribute("src", user?.avatar ?? "");
      },
    });
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.result) {
            avatarRef.current?.setAttribute("src", reader.result as string);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <AccountLayout title="My Profile">
      <div className="row">
        <div className="col-lg-9">
          <ErrorValidationAlert error={error} onClose={reset} />

          <Form onSubmit={handleSubmit}>
            <fieldset disabled={isPending}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Name
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    value={values?.name}
                    name="name"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Email
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="email"
                    value={values?.email}
                    name="email"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Phone Number
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    value={values?.phone || ""}
                    name="phone"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Gender
                </Form.Label>
                <Col sm="9">
                  <Form.Check
                    type="radio"
                    inline
                    label="Male"
                    name="sex"
                    defaultChecked={values?.sex === 1}
                    onChange={handleChange}
                    value={1}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    inline
                    name="sex"
                    defaultChecked={values?.sex === 2}
                    onChange={handleChange}
                    value={2}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Date of Birth
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="date"
                    value={values?.birth_date || ""}
                    name="birth_date"
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="3"></Form.Label>
                <Col sm="9">
                  <Button variant="primary" type="submit">
                    <i className="fa-solid fa-floppy-disk me-2"></i>Save Changes
                  </Button>
                </Col>
              </Form.Group>
            </fieldset>

            <input
              type="file"
              className="d-none"
              ref={inputAvatarRef}
              name="avatar"
              accept=".jpg,.jpeg,.png"
              onChange={handleAvatarChange}
            />
          </Form>
        </div>
        <div className="col-lg-3">
          <div className="text-center">
            <img
              src={user?.avatar}
              alt="Avatar"
              className="rounded-circle img-fluid object-fit-cover img-thumbnail mb-3"
              style={{ width: 100, height: 100 }}
              ref={avatarRef}
              loading="lazy"
            />

            <div className="mb-3">
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  inputAvatarRef.current?.click();
                }}
              >
                <i className="fa-solid fa-arrow-up-from-bracket me-2"></i>
                Select Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

export default ProfilePage;
