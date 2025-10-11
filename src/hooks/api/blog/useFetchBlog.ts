import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { BlogDetailTypes } from "../../../types/blog";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchBlog = (slug?: string) =>
  useQuery<BlogDetailTypes>({
    queryKey: [QUERY_KEYS.BLOG, slug],
    queryFn: () => apiClient().get(`/blogs/${slug}`),
    staleTime: Infinity,
    enabled: !!slug,
    retry: 3,
  });
