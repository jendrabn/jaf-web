import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export const useLogout = () =>
  useMutation({
    mutationFn: () => fetchApi().delete("/auth/logout"),
  });
