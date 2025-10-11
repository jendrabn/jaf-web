import { useMutation } from "@tanstack/react-query";
import type {
  ShippingCostReqTypes,
  ShippingCostTypes,
} from "../../../types/checkout";
import apiClient from "../../../utils/api";

export const useFetchShippingCosts = () =>
  useMutation<ShippingCostTypes[], Error, ShippingCostReqTypes>({
    mutationFn: (data) => apiClient().post("/shipping_costs", data),
  });
