import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const useUpdateCart = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiClient().put(`/carts/${id}`, data),
  });
