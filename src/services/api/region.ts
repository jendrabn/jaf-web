import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import type { CityTypes, ProvinceTypes } from "../../types/region";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchProvinces = () =>
  useQuery<ProvinceTypes[]>({
    queryKey: [QUERY_KEYS.PROVINCES],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/region/provinces",
      }),
    staleTime: Infinity,
  });

export const useFetchCities = (provinceId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.CITIES, provinceId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/region/cities/${provinceId}`,
      }),
    staleTime: Infinity,
    enabled: !!provinceId,
  });
