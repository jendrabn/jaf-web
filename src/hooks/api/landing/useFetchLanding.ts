import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { ProductItemTypes } from "../../../types/product";
import type { BannerTypes } from "../../../types/banner";
import type { BlogItemTypes } from "../../../types/blog";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchLanding = () =>
  useQuery<{
    products: ProductItemTypes[];
    banners: BannerTypes[];
    blogs: BlogItemTypes[];
  }>({
    queryKey: [QUERY_KEYS.LANDING],
    queryFn: () => apiClient().get("/landing"),
    retry: 3,
  });
