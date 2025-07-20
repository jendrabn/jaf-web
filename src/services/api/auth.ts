import { useMutation } from "@tanstack/react-query";
import type {
  ForgotPasswordReqTypes,
  LoginReqTypes,
  LoginTypes,
  RegisterReqTypes,
  RegisterTypes,
  ResetPasswordReqTypes,
} from "../../types/auth";
import apiClient from "../../utils/api";
import type { NoContentTypes } from "../../types";

export const useLogin = () =>
  useMutation<LoginTypes, Error, LoginReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/login", data),
  });

export const useRegister = () =>
  useMutation<RegisterTypes, Error, RegisterReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/register", data),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => apiClient().delete("/auth/logout"),
  });

export const useForgotPassword = () =>
  useMutation<NoContentTypes, Error, ForgotPasswordReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/forgot_password", data),
  });

export const useResetPassword = () =>
  useMutation<NoContentTypes, Error, ResetPasswordReqTypes>({
    mutationFn: (data) => apiClient().put("/auth/reset_password", data),
  });
