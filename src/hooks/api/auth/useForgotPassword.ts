import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordReqTypes } from "../../../types/auth";
import apiClient from "../../../utils/api";
import type { NoContentTypes } from "../../../types";

export const useForgotPassword = () =>
  useMutation<NoContentTypes, Error, ForgotPasswordReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/forgot_password", data),
  });
