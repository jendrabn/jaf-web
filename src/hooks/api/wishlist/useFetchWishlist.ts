import { useQuery } from "@tanstack/react-query";
import type { WishlistTypes } from "@/types/wishlist";
import { QUERY_KEYS } from "@/utils/constans";
import fetchApi from "@/utils/api";

export const useFetchWishlist = () =>
  useQuery<WishlistTypes[]>({
    queryKey: [QUERY_KEYS.WISHLISTS],
    queryFn: () => fetchApi().get("/wishlist"),
    retry: 3,
  });
