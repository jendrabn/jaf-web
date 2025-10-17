import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { CityTypes } from "@/types/region";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchSubDistricts = (districtId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.SUBDISTRICTS, districtId],
    queryFn: () => fetchApi().get(`/region/sub-districts/${districtId}`),
    staleTime: Infinity,
    enabled: !!districtId,
    retry: 3,
  });
