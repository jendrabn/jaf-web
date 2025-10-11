import { useMutation } from "@tanstack/react-query";
import type { OrderReqTypes, OrderSuccessTypes } from "../../../types/order";
import apiClient from "../../../utils/api";

export const useCreateOrder = () =>
  useMutation<OrderSuccessTypes, Error, OrderReqTypes>({
    mutationFn: (data) => apiClient().post("/orders", data),
  });
