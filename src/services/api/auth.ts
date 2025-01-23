import { useMutation } from "@tanstack/react-query";
import {
  ForgotPasswordReqTypes,
  LoginReqTypes,
  RegisterReqTypes,
  ResetPasswordReqTypes,
} from "../../types/auth";
import { callApi } from "../../utils/functions";

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginReqTypes) =>
      callApi({
        method: "POST",
        url: "/auth/login",
        data,
      }),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterReqTypes) =>
      callApi({
        method: "POST",
        url: "/auth/register",
        data,
      }),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () =>
      callApi({
        method: "DELETE",
        url: "/auth/logout",
        token: true,
      }),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordReqTypes) =>
      callApi({
        method: "POST",
        url: "/auth/forgot_password",
        data,
      }),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordReqTypes) =>
      callApi({
        method: "PUT",
        url: "/auth/reset_password",
        data,
      }),
  });
