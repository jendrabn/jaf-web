import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { UserTypes } from "@/types/user";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchUser = () => {
  return useQuery<UserTypes>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => fetchApi().get("/user"),
    //
  });
};
