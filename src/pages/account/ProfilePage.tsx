import { Row, Col, Button, Form } from "react-bootstrap";
import { useAuthState } from "../../contexts/AuthContext";
import type { UserTypes } from "../../types/user";
import AccountLayout from "../../layouts/AccountLayout";
import { useUpdateUser } from "../../services/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { type ChangeEvent, useRef } from "react";
import ErrorValidationAlert from "../../components/ErrorValidationAlert";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

function ProfilePage() {
  const { user } = useAuthState();

  const queryClient = useQueryClient();

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);

  const { mutate, isPending, error, reset } = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch,
    setValue,
  } = useForm<UserTypes>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      sex: user?.sex || null,
      birth_date: user?.birth_date || "",
    },
  });

  const watchedSex = watch("sex");

  const onSubmit = (data: UserTypes) => {
    const formData = new FormData();

    // Append form data
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("sex", data.sex?.toString() || "1");
    formData.append("birth_date", data.birth_date || "");

    // Append avatar file if exists
    if (inputAvatarRef.current?.files?.[0]) {
      formData.append("avatar", inputAvatarRef.current.files[0]);
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success("Berhasil memperbarui profil.");

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
    <AccountLayout title="Profil">
      <Helmet>
        <title>Profil | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error} onClose={reset} />
      <div className="row flex-row-reverse">
        <div className="col-lg-3">
          <div className="text-center mb-3 mb-lg-0">
            <img
              src={user?.avatar}
              alt="Avatar"
              className="rounded-circle img-fluid object-fit-cover border-primary border border-primary border-3 border-opacity-50 mb-2"
              style={{ width: 100, height: 100 }}
              ref={avatarRef}
              loading="lazy"
            />

            <br />

            <Button
              variant="light"
              size="sm"
              className="border"
              onClick={() => {
                inputAvatarRef.current?.click();
              }}
            >
              <i className="bi bi-upload me-2"></i> Upload Foto
            </Button>
          </div>
        </div>
        <div className="col-lg-9">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isPending}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Nama
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="text" {...register("name")} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Email
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="email" {...register("email")} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Nomor Telepon
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="text" {...register("phone")} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Jenis Kelamin
                </Form.Label>
                <Col sm="9">
                  <Form.Check
                    type="radio"
                    inline
                    label="Laki-laki"
                    name="sex"
                    checked={watchedSex === 1}
                    onChange={() => setValue("sex", 1)}
                  />
                  <Form.Check
                    type="radio"
                    label="Perempuan"
                    inline
                    name="sex"
                    checked={watchedSex === 2}
                    onChange={() => setValue("sex", 2)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3" className="text-gray-700">
                  Tanggal Lahir
                </Form.Label>
                <Col sm="9">
                  <Form.Control type="date" {...register("birth_date")} />
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="3"></Form.Label>
                <Col sm="9">
                  <Button variant="primary" type="submit">
                    <i className="bi bi-check2-circle me-2"></i>Simpan
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
      </div>
    </AccountLayout>
  );
}

export default ProfilePage;
