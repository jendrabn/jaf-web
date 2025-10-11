import { useMutation } from "@tanstack/react-query";
import type { CheckoutReqTypes } from "../../../types/checkout";
import apiClient from "../../../utils/api";

export const useCheckoutState = () =>
  useMutation({
    mutationFn: (data: CheckoutReqTypes) => apiClient().post("/checkout", data),
  });
