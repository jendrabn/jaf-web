import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CartItemTypes,
  CartReqTypes,
  deleteReqTypes,
  updateReqTypes,
} from "../../types/cart";
import { callApi } from "../../utils/functions";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchCarts = () =>
  useQuery<CartItemTypes[]>({
    queryKey: [QUERY_KEYS.CARTS],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/carts",
        token: true,
      }),
  });

export const useCreateCart = () =>
  useMutation({
    mutationFn: (data: CartReqTypes) =>
      callApi({
        method: "POST",
        url: "/carts",
        data,
        token: true,
      }),
  });

export const useUpdateCart = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: updateReqTypes }) =>
      callApi({
        method: "PUT",
        url: `/carts/${id}`,
        data,
        token: true,
      }),
  });

export const useDeleteCart = () =>
  useMutation({
    mutationFn: (data: deleteReqTypes) =>
      callApi({
        method: "DELETE",
        url: "/carts",
        data,
        token: true,
      }),
  });
