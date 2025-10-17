import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordReqTypes } from "@/types/auth";
import fetchApi from "@/utils/api";
import type { NoContentTypes } from "@/types";

export const useForgotPassword = () =>
  useMutation<NoContentTypes, Error, ForgotPasswordReqTypes>({
    mutationFn: (data) => fetchApi().post("/auth/forgot_password", data),
  });
