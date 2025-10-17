import { useMutation } from "@tanstack/react-query";
import type { CartReqTypes } from "@/types/cart";
import { AxiosError } from "axios";
import fetchApi from "@/utils/api";
import type { NoContentTypes } from "@/types";

export const useCreateCart = () =>
  useMutation<NoContentTypes, AxiosError, CartReqTypes>({
    mutationFn: (data) => fetchApi().post("/carts", data),
  });
