import { useMutation } from "@tanstack/react-query";
import type { RegisterReqTypes, RegisterTypes } from "../../../types/auth";
import apiClient from "../../../utils/api";

export const useRegister = () =>
  useMutation<RegisterTypes, Error, RegisterReqTypes>({
    mutationFn: (data) => apiClient().post("/auth/register", data),
  });
