import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export const useDeleteCart = () =>
  useMutation({
    mutationFn: (data: unknown) =>
      fetchApi().post("/carts?_method=DELETE", data),
  });
