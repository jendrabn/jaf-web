import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DeleteWishlistReqTypes,
  WishlistReqTypes,
  WishlistTypes,
} from "../../types/wishlist";
import { callApi } from "../../utils/functions";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchWishlist = () =>
  useQuery<WishlistTypes[]>({
    queryKey: [QUERY_KEYS.WISHLISTS],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/wishlist",
        token: true,
      }),
  });

export const useCreateWishlist = () =>
  useMutation({
    mutationFn: (data: WishlistReqTypes) =>
      callApi({
        method: "POST",
        url: "/wishlist",
        data,
        token: true,
      }),
  });

export const useDeleteWishlist = () =>
  useMutation({
    mutationFn: (data: DeleteWishlistReqTypes) =>
      callApi({
        method: "DELETE",
        url: "/wishlist",
        data,
        token: true,
      }),
  });
