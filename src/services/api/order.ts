import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CheckoutReqTypes,
  ShippingCostReqTypes,
  ShippingCostTypes,
} from "../../types/checkout";
import type {
  ConfirmPaymentReqTypes,
  OrderDetailTypes,
  OrderReqTypes,
  OrderSuccessTypes,
  OrderTypes,
  RatingReqTypes,
} from "../../types/order";
import { getAuthToken } from "../../utils/functions";
import type { PageTypes } from "../../types";
import { QUERY_KEYS } from "../../utils/constans";
import apiClient from "../../utils/api";

export const useCheckoutState = () =>
  useMutation({
    mutationFn: (data: CheckoutReqTypes) => apiClient().post("/checkout", data),
  });

export const useFetchShippingCosts = () =>
  useMutation<ShippingCostTypes[], Error, ShippingCostReqTypes>({
    mutationFn: (data) => apiClient().post("/shipping_costs", data),
  });

export const useFetchOrders = (queryString?: string) =>
  useQuery<{ data: OrderTypes[]; page: PageTypes }>({
    queryKey: [QUERY_KEYS.ORDERS, queryString],
    queryFn: () =>
      apiClient().get(`/orders${queryString ? `?${queryString}` : ""}`),
    retry: 3,
  });

export const useCreateOrder = () =>
  useMutation<OrderSuccessTypes, Error, OrderReqTypes>({
    mutationFn: (data) => apiClient().post("/orders", data),
  });

export const useFetchOrder = (orderId?: number) =>
  useQuery<OrderDetailTypes>({
    queryKey: [QUERY_KEYS.ORDER, orderId],
    queryFn: () => apiClient().get(`/orders/${orderId}`),
    enabled: !!getAuthToken() && !!orderId,
    retry: 3,
  });

export const useConfirmPayment = () =>
  useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ConfirmPaymentReqTypes;
    }) => apiClient().post(`/orders/${orderId}/confirm_payment`, data),
  });

export const useConfirmOrderReceived = () =>
  useMutation({
    mutationFn: (orderId: number) =>
      apiClient().put(`/orders/${orderId}/confirm_order_delivered`),
  });

export const useAddRating = () =>
  useMutation({
    mutationFn: (data: RatingReqTypes[]) =>
      apiClient().post("/orders/ratings", {
        ratings: data,
      }),
  });
