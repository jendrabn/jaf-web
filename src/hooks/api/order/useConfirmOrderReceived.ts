import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const useConfirmOrderReceived = () =>
  useMutation({
    mutationFn: (orderId: number) =>
      apiClient().put(`/orders/${orderId}/confirm_order_delivered`),
  });
