import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { BlogCategoryTypes } from "../../../types/blog";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchBlogCategories = () =>
  useQuery<BlogCategoryTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_CATEGORIES],
    queryFn: () => apiClient().get("/blogs/categories"),
    staleTime: Infinity,
    retry: 3,
  });
