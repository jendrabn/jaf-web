import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { RatingReqTypes } from "../../../types/order";

export const useAddRating = () =>
  useMutation({
    mutationFn: (data: RatingReqTypes[]) =>
      apiClient().post("/orders/ratings", {
        ratings: data,
      }),
  });
