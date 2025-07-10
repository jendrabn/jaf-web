import { useMutation } from "@tanstack/react-query";
import type {
  ForgotPasswordReqTypes,
  LoginReqTypes,
  RegisterReqTypes,
  ResetPasswordReqTypes,
} from "../../types/auth";
import apiClient from "../../utils/api";

interface LoginTypes {
  auth_token: string;
}

export const useLogin = () =>
  useMutation<LoginTypes, Error, LoginReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/login", data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterReqTypes) =>
      apiClient().post("/auth/register", data),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => apiClient().delete("/auth/logout"),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordReqTypes) =>
      apiClient().post("/auth/forgot_password", data),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordReqTypes) =>
      apiClient().put("/auth/reset_password", data),
  });
