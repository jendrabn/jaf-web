import { useMutation } from "@tanstack/react-query";
import type {
  ApplyCouponReqTypes,
  ApplyCouponResTypes,
} from "../../../types/checkout";
import apiClient from "../../../utils/api";

export const useApplyCoupon = () =>
  useMutation<ApplyCouponResTypes, Error, ApplyCouponReqTypes>({
    mutationFn: (data) => apiClient().post("/apply_coupon", data),
  });
