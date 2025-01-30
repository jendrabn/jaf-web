import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import { ProductItemTypes } from "../../types/product";
import { BannerTypes } from "../../types/banner";
import { BlogItemTypes } from "../../types/blog";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchLanding = () =>
  useQuery<{
    products: ProductItemTypes[];
    banners: BannerTypes[];
    blogs: BlogItemTypes[];
  }>({
    queryKey: [QUERY_KEYS.LANDING],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/landing",
      }),
  });
