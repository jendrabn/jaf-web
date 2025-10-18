import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Form } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router";
import ErrorValidationAlert from "@/components/ui/ErrorValidationAlert";
import { env } from "@/utils/config";
import { useVerifyLoginOtp } from "@/hooks/api/auth/useVerifyLoginOtp";
import { useResendLoginOtp } from "@/hooks/api/auth/useResendLoginOtp";
import { setAuthToken, setSelectedCartIds } from "@/utils/functions";
import { useEffect, useRef, useState } from "react";

type FormFields = {
  otp: string;
};

const VerifyLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as {
    state?: { email?: string; from?: string };
    pathname: string;
  };

  const emailFromState = location?.state?.email;
  const emailFromStorage =
    sessionStorage.getItem("pendingLoginEmail") || undefined;
  const email = emailFromState || emailFromStorage;

  useEffect(() => {
    // If there's no email context, redirect back to login
    if (!email) {
      navigate("/auth/login", { replace: true });
    }
  }, [email, navigate]);

  const { mutate, error, isPending, reset: resetError } = useVerifyLoginOtp();

  const { register, handleSubmit, setValue } = useForm<FormFields>();

  // Resend OTP handling
  const {
    mutate: resend,
    isPending: isResending,
    error: resendError,
    reset: resetResendError,
  } = useResendLoginOtp();

  const [sentTo, setSentTo] = useState<string | undefined>(
    (sessionStorage.getItem("otpSentTo") || undefined) as string | undefined
  );
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | undefined>(
    (sessionStorage.getItem("otpExpiresAt") || undefined) as string | undefined
  );

  // OTP inputs management (6 individual inputs)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));

  const updateOtpValue = (next: string[]) => {
    setDigits(next);
    setValue("otp", next.join(""), { shouldDirty: true });
  };

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 1);
      const next = [...digits];
      next[index] = val;
      updateOtpValue(next);
      if (val && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = [...digits];
        if (next[index]) {
          next[index] = "";
          updateOtpValue(next);
        } else if (index > 0) {
          inputsRef.current[index - 1]?.focus();
          const prev = [...digits];
          prev[index - 1] = "";
          updateOtpValue(prev);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (
        e.key === "ArrowRight" &&
        index < inputsRef.current.length - 1
      ) {
        inputsRef.current[index + 1]?.focus();
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      e.preventDefault();
      const next = Array(6)
        .fill("")
        .map((_, i) => text[i] || "");
      updateOtpValue(next);
      inputsRef.current[5]?.focus();
    }
  };

  const onSubmit: SubmitHandler<FormFields> = ({ otp }) => {
    if (!email) return;

    mutate(
      { email, code: otp },
      {
        onSuccess: (resp) => {
          const token = (resp as { auth_token?: string }).auth_token;
          if (!token) {
            return;
          }
          // Store token then continue to previous route or home
          setAuthToken(token);
          setSelectedCartIds([]);
          sessionStorage.removeItem("pendingLoginEmail");
          sessionStorage.removeItem("otpExpiresAt");
          sessionStorage.removeItem("otpSentTo");
          // No client-side rate limit cleanup needed

          navigate(location.state?.from || "/", { replace: true });
          // Ensure app state reflects authenticated user
          window.location.reload();
        },
      }
    );
  };

  return (
    <AuthLayout title="Verifikasi Login">
      <Helmet>
        <title>Verifikasi Login | {env.APP_NAME}</title>
      </Helmet>

      <ErrorValidationAlert error={error as Error} onClose={resetError} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isPending}>
          <p className="mb-3">
            Masukkan 6 digit kode OTP yang telah dikirim ke email{" "}
            <span className="fw-semibold">{sentTo || email}</span>
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Kode OTP</Form.Label>
            <div
              className="d-flex gap-2 justify-content-center"
              onPaste={handlePaste}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Form.Control
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="\d"
                  maxLength={1}
                  className="text-center fw-semibold"
                  style={{ width: "48px", height: "48px" }}
                  value={digits[i]}
                  onChange={handleChange(i)}
                  onKeyDown={handleKeyDown(i)}
                  ref={(el: HTMLInputElement | null) =>
                    (inputsRef.current[i] = el)
                  }
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <Form.Text className="text-muted">
              Periksa spam jika tidak menemukan email OTP.
            </Form.Text>
            {/* Hidden field bound to react-hook-form to submit combined OTP */}
            <input type="hidden" {...register("otp")} value={digits.join("")} />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              {otpExpiresAt
                ? `Kode berlaku hingga ${new Date(
                    otpExpiresAt
                  ).toLocaleString()}`
                : ""}
            </small>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={() => {
                  resetResendError();
                  if (!email) return;
                  resend(
                    { email },
                    {
                      onSuccess: ({ otp_expires_at, otp_sent_to }) => {
                        // Laravel API handles rate limit and cooldown. No client-side timer here.
                        if (otp_expires_at) {
                          setOtpExpiresAt(otp_expires_at);
                          sessionStorage.setItem(
                            "otpExpiresAt",
                            otp_expires_at
                          );
                        }
                        if (otp_sent_to) {
                          setSentTo(otp_sent_to);
                          sessionStorage.setItem("otpSentTo", otp_sent_to);
                        }
                        // clear inputs and focus first
                        const cleared = Array(6).fill("");
                        setDigits(cleared);
                        setValue("otp", "");
                        inputsRef.current[0]?.focus();
                      },
                    }
                  );
                }}
                disabled={isResending}
              >
                Kirim ulang kode
              </Button>
            </div>
          </div>

          <ErrorValidationAlert
            error={resendError as unknown as Error}
            onClose={resetResendError}
          />

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              Verifikasi
            </Button>
          </div>
        </fieldset>
      </Form>
    </AuthLayout>
  );
};

export default VerifyLoginPage;
