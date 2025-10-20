import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { BlogItemTypes } from "@/types/blog";
import type { PageTypes } from "@/types";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchBlogs = (queryString?: string) =>
  useQuery<{
    data: BlogItemTypes[];
    page: PageTypes;
  }>({
    queryKey: [QUERY_KEYS.BLOGS, queryString],
    queryFn: () =>
      fetchApi().get(`/blogs${queryString ? `?${queryString}` : ""}`),
    staleTime: Infinity,
  });
