import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { PasswordReqTypes } from "../../../types/user";

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (data: PasswordReqTypes) =>
      apiClient().put("/user/change_password", data),
  });
