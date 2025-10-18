import { useMutation } from "@tanstack/react-query";
import type { LoginTypes } from "@/types/auth";
import fetchApi from "@/utils/api";

export type VerifyLoginOtpReq = {
  email: string;
  code: string; // 6-digit OTP code
};

export const useVerifyLoginOtp = () =>
  useMutation<LoginTypes, Error, VerifyLoginOtpReq>({
    mutationFn: (data) => fetchApi().post("/auth/verify_login_otp", data),
  });
