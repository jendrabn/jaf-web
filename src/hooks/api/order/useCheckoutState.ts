import { useMutation } from "@tanstack/react-query";
import type { CheckoutReqTypes } from "@/types/checkout";
import fetchApi from "@/utils/api";

export const useCheckoutState = () =>
  useMutation({
    mutationFn: (data: CheckoutReqTypes) => fetchApi().post("/checkout", data),
  });
