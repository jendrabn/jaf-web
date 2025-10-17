import { useMutation } from "@tanstack/react-query";
import type { OrderReqTypes, OrderSuccessTypes } from "@/types/order";
import fetchApi from "@/utils/api";

export const useCreateOrder = () =>
  useMutation<OrderSuccessTypes, Error, OrderReqTypes>({
    mutationFn: (data) => fetchApi().post("/orders", data),
  });
