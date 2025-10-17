import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { PasswordReqTypes } from "@/types/user";

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (data: PasswordReqTypes) =>
      fetchApi().put("/user/change_password", data),
  });
