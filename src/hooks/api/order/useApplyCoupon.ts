import { useMutation } from "@tanstack/react-query";
import type {
  ApplyCouponReqTypes,
  ApplyCouponResTypes,
} from "@/types/checkout";
import fetchApi from "@/utils/api";

export const useApplyCoupon = () =>
  useMutation<ApplyCouponResTypes, Error, ApplyCouponReqTypes>({
    mutationFn: (data) => fetchApi().post("/apply_coupon", data),
  });
