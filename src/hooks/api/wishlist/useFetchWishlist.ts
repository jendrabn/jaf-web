import { useQuery } from "@tanstack/react-query";
import type { WishlistTypes } from "../../../types/wishlist";
import { QUERY_KEYS } from "../../../utils/constans";
import apiClient from "../../../utils/api";

export const useFetchWishlist = () =>
  useQuery<WishlistTypes[]>({
    queryKey: [QUERY_KEYS.WISHLISTS],
    queryFn: () => apiClient().get("/wishlist"),
    retry: 3,
  });
