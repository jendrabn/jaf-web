import { Helmet } from "react-helmet-async";
import { Form, Alert } from "react-bootstrap";
import Layout from "@/components/layouts/Layout";
import CustomerServiceContact from "@/components/parts/CustomerServiceContact";
import { env } from "@/utils/config";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";

function ContactPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  type ContactFormInputs = {
    name: string;
    email: string;
    phone?: string;
    message: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  // Tipe request/response sesuai spesifikasi API (tanpa wrapper "request")
  type ContactPayload = {
    name: string;
    email: string;
    phone?: string;
    message: string;
  };
  type ContactResponse = {
    id: number;
    status: string;
    message: string;
  };
  type ApiError = { message?: string };

  const contactMutation = useMutation<
    ContactResponse,
    AxiosError<ApiError>,
    ContactPayload
  >({
    mutationFn: (payload) => fetchApi().post("/contact", payload),
    onSuccess: (res) => {
      const msg = res?.message || "Terima kasih, pesan Anda sudah kami terima.";
      setSuccessMessage(msg);
      setErrorMessage(null);
      reset();
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal mengirim pesan. Silakan coba lagi.";
      setErrorMessage(msg);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: ContactFormInputs) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    contactMutation.mutate({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      message: data.message,
    });
  };

  return (
    <Layout>
      <Helmet>
        <meta
          name="description"
          content="Hubungi JAF Parfum's untuk pertanyaan, bantuan, atau kerjasama. Kami siap membantu Anda!"
        />
        <title>Kontak Kami | {env.APP_NAME}</title>
      </Helmet>

      <div className="container">
        <h1 className="mb-5 fw-bold text-center">Hubungi Kami</h1>

        <div className="row g-5 align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-white-subtle rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
              <p className="mb-4 text-muted">
                Ada pertanyaan, kritik, saran, atau ingin kerjasama? Silakan isi
                form di bawah ini. Tim kami akan membalas dalam 1x24 jam pada
                hari kerja.
              </p>
              {/* Status sukses / error */}
              {successMessage && (
                <Alert variant="success" className="mb-3">
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="danger" className="mb-3">
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3" controlId="contactName">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama Anda"
                    {...register("name", { required: "Nama wajib diisi" })}
                    isInvalid={!!errors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@domain.com"
                    {...register("email", {
                      required: "Email wajib diisi",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Format email tidak valid",
                      },
                    })}
                    isInvalid={!!errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactPhone">
                  <Form.Label>No. Telepon (Opsional)</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register("phone", {
                      pattern: {
                        value: /^0\d{8,14}$/,
                        message: "Format no. telepon tidak valid",
                      },
                    })}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactMessage">
                  <Form.Label>Pesan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tulis pesan Anda di sini..."
                    {...register("message", {
                      required: "Pesan wajib diisi",
                      minLength: {
                        value: 10,
                        message: "Pesan minimal 10 karakter",
                      },
                    })}
                    isInvalid={!!errors.message}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={contactMutation.isPending || isSubmitting}
                >
                  <i className="bi bi-send me-2"></i>
                  {contactMutation.isPending || isSubmitting
                    ? "Mengirim..."
                    : "Kirim Pesan"}
                </button>
              </Form>
              <div className="mt-4 border-top pt-4">
                <CustomerServiceContact />
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-stretch">
            <iframe
              title="Lokasi JAF Parfum's"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.21554637957!2d113.7107621745602!3d-8.181028682013878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6942986b10fb5%3A0x25e647f267f7b636!2sKANTOR%20JAF%20PARFUM&#39;s!5e0!3m2!1sid!2sid!4v1750245222336!5m2!1sid!2sid"
              allowFullScreen
              loading="lazy"
              className="w-100 rounded-3"
              style={{ maxHeight: 400 }}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;
