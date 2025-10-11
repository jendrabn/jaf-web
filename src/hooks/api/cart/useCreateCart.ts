import { useMutation } from "@tanstack/react-query";
import type { CartReqTypes } from "../../../types/cart";
import { AxiosError } from "axios";
import apiClient from "../../../utils/api";
import type { NoContentTypes } from "../../../types";

export const useCreateCart = () =>
  useMutation<NoContentTypes, AxiosError, CartReqTypes>({
    mutationFn: (data) => apiClient().post("/carts", data),
  });
