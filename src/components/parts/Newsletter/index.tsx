import { useState } from "react";
import { useForm } from "react-hook-form";
import useSubscribeNewsletter from "@/hooks/api/newsletter/useSubscribeNewsletter";
import type { NewsletterRequest } from "@/types/newsletter";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";

const Newsletter = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterRequest>();

  const subscribeMutation = useSubscribeNewsletter();

  const onSubmit = (data: NewsletterRequest) => {
    subscribeMutation.mutate(data, {
      onSuccess: () => {
        setIsSubscribed(true);
        reset();
        setTimeout(() => setIsSubscribed(false), 5000);
      },
    });
  };

  return (
    <section className="newsletter-section py-5 bg-primary bg-gradient">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center text-white mb-4">
              <h2 className="h3 mb-3">Newsletter</h2>
              <p className="mb-0">
                Dapatkan penawaran spesial dan informasi produk terbaru dari
                kami
              </p>
            </div>

            {isSubscribed ? (
              <Alert variant="primary">
                <Alert.Heading>Terima kasih!</Alert.Heading>
                <p className="mb-0">
                  Anda telah berlangganan newsletter kami. Kami akan mengirimkan
                  penawaran spesial dan informasi produk terbaru ke email Anda.
                </p>
              </Alert>
            ) : (
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="newsletter-form"
              >
                <InputGroup className="newsletter-input-group">
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Masukkan email Anda"
                    {...register("email", {
                      required: "Email wajib diisi",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Format email tidak valid",
                      },
                    })}
                    isInvalid={!!errors.email}
                    disabled={subscribeMutation.isPending}
                  />
                  <Button
                    type="submit"
                    variant="dark"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending
                      ? "Mengirim..."
                      : "Berlangganan"}
                  </Button>
                </InputGroup>
                {errors.email && (
                  <Form.Text className="text-danger mt-2 d-block">
                    {errors.email.message}
                  </Form.Text>
                )}
              </Form>
            )}

            <p className="text-white-50 text-center mt-3 mb-0 small">
              Kami menghargai privasi Anda. Berlangganan berarti Anda setuju
              dengan kebijakan privasi kami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
