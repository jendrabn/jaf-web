import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import { ProductItemTypes } from "../../types/product";
import { BannerTypes } from "../../types/banner";
import { BlogItemTypes } from "../../types/blog";

export const useFetchLanding = () =>
  useQuery<{
    products: ProductItemTypes[];
    banners: BannerTypes[];
    blogs: BlogItemTypes[];
  }>({
    queryKey: ["landing"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/landing",
      }),
  });
