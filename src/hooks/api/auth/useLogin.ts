import { useMutation } from "@tanstack/react-query";
import type { LoginReqTypes, LoginTypes } from "@/types/auth";
import fetchApi from "@/utils/api";

export const useLogin = () =>
  useMutation<LoginTypes, Error, LoginReqTypes>({
    mutationFn: (data) => fetchApi().post("/auth/login", data),
  });
