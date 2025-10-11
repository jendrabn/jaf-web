import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { UserTypes } from "../../../types/user";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchUser = () => {
  return useQuery<UserTypes>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => apiClient().get("/user"),
    retry: 3,
  });
};
