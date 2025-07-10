import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DeleteWishlistReqTypes,
  WishlistReqTypes,
  WishlistTypes,
} from "../../types/wishlist";
import { QUERY_KEYS } from "../../utils/constans";
import apiClient from "../../utils/api";

export const useFetchWishlist = () =>
  useQuery<WishlistTypes[]>({
    queryKey: [QUERY_KEYS.WISHLISTS],
    queryFn: () => apiClient().get("/wishlist"),
    retry: 3,
  });

export const useCreateWishlist = () =>
  useMutation({
    mutationFn: (data: WishlistReqTypes) => apiClient().post("/wishlist", data),
  });

export const useDeleteWishlist = () =>
  useMutation({
    mutationFn: (data: DeleteWishlistReqTypes) =>
      apiClient().post("/wishlist?_method=DELETE", data),
  });
