import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ConfirmPaymentReqTypes } from "@/types/order";

export const useConfirmPayment = () =>
  useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ConfirmPaymentReqTypes;
    }) => fetchApi().post(`/orders/${orderId}/confirm_payment`, data),
  });
