import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordReqTypes } from "@/types/auth";
import fetchApi from "@/utils/api";
import type { NoContentTypes } from "@/types";

export const useResetPassword = () =>
  useMutation<NoContentTypes, Error, ResetPasswordReqTypes>({
    mutationFn: (data) => fetchApi().put("/auth/reset_password", data),
  });
