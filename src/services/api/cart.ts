import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CartItemTypes,
  CartReqTypes,
  deleteReqTypes,
  updateReqTypes,
} from "../../types/cart";
import { getAuthToken } from "../../utils/functions";
import { QUERY_KEYS } from "../../utils/constans";
import apiClient from "../../utils/api";

export const useFetchCarts = () =>
  useQuery<CartItemTypes[]>({
    queryKey: [QUERY_KEYS.CARTS],
    queryFn: () => apiClient().get("/carts"),
    enabled: !!getAuthToken(),
    retry: 3,
  });

export const useCreateCart = () =>
  useMutation({
    mutationFn: (data: CartReqTypes) => apiClient().post("/carts", data),
  });

export const useUpdateCart = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: updateReqTypes }) =>
      apiClient().put(`/carts/${id}`, data),
  });

export const useDeleteCart = () =>
  useMutation({
    mutationFn: (data: deleteReqTypes) =>
      apiClient().post("/carts?_method=DELETE", data),
  });
