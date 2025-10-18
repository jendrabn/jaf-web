import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export type ResendLoginOtpReq = {
  email: string;
};

export type ResendLoginOtpResp = {
  otp_required: boolean;
  otp_expires_at: string; // ISO timestamp when OTP expires
  otp_sent_to: string; // destination email
};

export const useResendLoginOtp = () =>
  useMutation<ResendLoginOtpResp, Error, ResendLoginOtpReq>({
    mutationFn: (data) => fetchApi().post("/auth/resend_login_otp", data),
  });
