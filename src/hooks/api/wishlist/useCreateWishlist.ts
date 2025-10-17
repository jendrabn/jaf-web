import { useMutation } from "@tanstack/react-query";
import type { WishlistReqTypes } from "@/types/wishlist";
import fetchApi from "@/utils/api";

export const useCreateWishlist = () =>
  useMutation({
    mutationFn: (data: WishlistReqTypes) => fetchApi().post("/wishlist", data),
  });
