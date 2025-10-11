import { useMutation } from "@tanstack/react-query";
import type { LoginReqTypes, LoginTypes } from "../../../types/auth";
import apiClient from "../../../utils/api";

export const useLogin = () =>
  useMutation<LoginTypes, Error, LoginReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/login", data),
  });
