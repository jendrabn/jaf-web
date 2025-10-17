import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ProvinceTypes } from "@/types/region";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchProvinces = () =>
  useQuery<ProvinceTypes[]>({
    queryKey: [QUERY_KEYS.PROVINCES],
    queryFn: () => fetchApi().get("/region/provinces"),
    staleTime: Infinity,
    retry: 3,
  });
