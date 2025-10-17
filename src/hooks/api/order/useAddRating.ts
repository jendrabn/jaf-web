import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { RatingReqTypes } from "@/types/order";

export const useAddRating = () =>
  useMutation({
    mutationFn: (data: RatingReqTypes[]) =>
      fetchApi().post("/orders/ratings", {
        ratings: data,
      }),
  });
