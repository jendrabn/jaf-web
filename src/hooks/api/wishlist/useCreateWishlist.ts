import { useMutation } from "@tanstack/react-query";
import type { WishlistReqTypes } from "../../../types/wishlist";
import apiClient from "../../../utils/api";

export const useCreateWishlist = () =>
  useMutation({
    mutationFn: (data: WishlistReqTypes) => apiClient().post("/wishlist", data),
  });
