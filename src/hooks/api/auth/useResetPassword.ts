import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordReqTypes } from "../../../types/auth";
import apiClient from "../../../utils/api";
import type { NoContentTypes } from "../../../types";

export const useResetPassword = () =>
  useMutation<NoContentTypes, Error, ResetPasswordReqTypes>({
    mutationFn: (data) => apiClient().put("/auth/reset_password", data),
  });
