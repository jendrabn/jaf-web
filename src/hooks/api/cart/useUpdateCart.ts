import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export const useUpdateCart = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      fetchApi().put(`/carts/${id}`, data),
  });
