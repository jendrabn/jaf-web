import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const useLogout = () =>
  useMutation({
    mutationFn: () => apiClient().delete("/auth/logout"),
  });
