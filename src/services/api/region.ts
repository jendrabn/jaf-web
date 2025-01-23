import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import { CityTypes, ProvinceTypes } from "../../types/region";

export const useFetchProvinces = () =>
  useQuery<ProvinceTypes[]>({
    queryKey: ["provinces"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/region/provinces",
      }),
    staleTime: Infinity,
  });

export const useFetchCities = (provinceId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: ["cities", provinceId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/region/cities/${provinceId}`,
      }),
    staleTime: Infinity,
    enabled: !!provinceId,
  });
