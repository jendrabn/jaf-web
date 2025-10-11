import { useMutation } from "@tanstack/react-query";
import type { DeleteWishlistReqTypes } from "../../../types/wishlist";
import apiClient from "../../../utils/api";

export const useDeleteWishlist = () =>
  useMutation({
    mutationFn: (data: DeleteWishlistReqTypes) =>
      apiClient().post("/wishlist?_method=DELETE", data),
  });
