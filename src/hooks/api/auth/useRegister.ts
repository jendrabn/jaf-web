import { useMutation } from "@tanstack/react-query";
import type { RegisterReqTypes, RegisterTypes } from "@/types/auth";
import fetchApi from "@/utils/api";

export const useRegister = () =>
  useMutation<RegisterTypes, Error, RegisterReqTypes>({
    mutationFn: (data) => fetchApi().post("/auth/register", data),
  });
