import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { FlashSaleScheduleTypes } from "@/types/flash-sale";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchFlashSales = () =>
  useQuery<FlashSaleScheduleTypes[]>({
    queryKey: [QUERY_KEYS.FLASH_SALES],
    queryFn: () => fetchApi().get("/flash-sale"),
  });
