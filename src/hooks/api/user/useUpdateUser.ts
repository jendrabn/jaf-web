import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const useUpdateUser = () =>
  useMutation({
    mutationFn: (data: FormData) => apiClient().post("/user?_method=PUT", data),
  });
