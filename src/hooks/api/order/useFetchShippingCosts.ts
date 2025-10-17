import { useMutation } from "@tanstack/react-query";
import type { ShippingCostReqTypes, ShippingCostTypes } from "@/types/checkout";
import fetchApi from "@/utils/api";

export const useFetchShippingCosts = () =>
  useMutation<ShippingCostTypes[], Error, ShippingCostReqTypes>({
    mutationFn: (data) => fetchApi().post("/shipping_costs", data),
  });
