import { useMutation } from "@tanstack/react-query";
import type { DeleteWishlistReqTypes } from "@/types/wishlist";
import fetchApi from "@/utils/api";

export const useDeleteWishlist = () =>
  useMutation({
    mutationFn: (data: DeleteWishlistReqTypes) =>
      fetchApi().post("/wishlist?_method=DELETE", data),
  });
