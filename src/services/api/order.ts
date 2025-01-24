import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckoutReqTypes, ShippingCostReqTypes } from "../../types/checkout";
import {
  ConfirmPaymentReqTypes,
  OrderDetailTypes,
  OrderReqTypes,
  OrderTypes,
} from "../../types/order";
import { callApi, getAuthToken } from "../../utils/functions";
import { PageTypes } from "../../types";

export const useCheckout = () =>
  useMutation({
    mutationFn: (data: CheckoutReqTypes) =>
      callApi({
        method: "POST",
        url: "/checkout",
        data,
        token: true,
      }),
  });

export const useFetchShippingCosts = () =>
  useMutation({
    mutationFn: (data: ShippingCostReqTypes) =>
      callApi({
        method: "POST",
        url: "/shipping_costs",
        data,
        token: true,
      }),
  });

export const useFetchOrders = (queryString?: string) =>
  useQuery<{ data: OrderTypes[]; page: PageTypes }>({
    queryKey: ["orders", queryString],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/orders${queryString ? `?${queryString}` : ""}`,
        token: true,
      }),
    enabled: !!getAuthToken(),
  });

export const useCreateOrder = () =>
  useMutation({
    mutationFn: (data: OrderReqTypes) =>
      callApi({
        method: "POST",
        url: "/orders",
        data,
        token: true,
      }),
  });

export const useFetchOrder = (orderId: number) =>
  useQuery<OrderDetailTypes>({
    queryKey: ["order", orderId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/orders/${orderId}`,
        token: true,
      }),
    enabled: !!getAuthToken(),
  });

export const useConfirmPayment = () =>
  useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: ConfirmPaymentReqTypes;
    }) =>
      callApi({
        method: "POST",
        url: `/orders/${orderId}/confirm_payment`,
        token: true,
        data,
      }),
  });

export const useConfirmOrderReceived = () =>
  useMutation({
    mutationFn: (orderId: number) =>
      callApi({
        method: "PUT",
        url: `/orders/${orderId}/confirm_order_delivered`,
        token: true,
      }),
  });
