import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const useDeleteCart = () =>
  useMutation({
    mutationFn: (data: unknown) =>
      apiClient().post("/carts?_method=DELETE", data),
  });
