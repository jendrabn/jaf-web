import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export const useConfirmOrderReceived = () =>
  useMutation({
    mutationFn: (orderId: number) =>
      fetchApi().put(`/orders/${orderId}/confirm_order_delivered`),
  });
