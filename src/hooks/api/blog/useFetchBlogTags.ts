import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { BlogTagTypes } from "../../../types/blog";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchBlogTags = () =>
  useQuery<BlogTagTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_TAGS],
    queryFn: () => apiClient().get("/blogs/tags"),
    staleTime: Infinity,
    retry: 3,
  });
