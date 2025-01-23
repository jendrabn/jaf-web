import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DeleteWishlistReqTypes,
  WishlistReqTypes,
  WishlistTypes,
} from "../../types/wishlist";
import { callApi, getAuthToken } from "../../utils/functions";

export const useFetchWishlist = () =>
  useQuery<WishlistTypes[]>({
    queryKey: ["wishlists"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/wishlist",
        token: true,
      }),
    enabled: !!getAuthToken(),
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
