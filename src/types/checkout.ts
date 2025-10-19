import type { CartItemTypes } from "./cart";
import type {
  BankTypes,
  EwalletTypes,
  PaymentGatewayTypes,
} from "./payment-method";
import type {
  CityTypes,
  DistrictTypes,
  ProvinceTypes,
  SubDistrictTypes,
} from "./region";

export interface CheckoutTypes {
  shipping_address: AddressTypes;
  carts: Array<CartItemTypes>;
  shipping_methods: Array<ShippingCostTypes>;
  payment_methods: {
    bank: Array<BankTypes>;
    ewallet: Array<EwalletTypes>;
    gateway?: PaymentGatewayTypes | null;
  };
  taxes: Array<TaxTypes>;
  total_quantity: number;
  total_weight: number;
  total_price: number;
  total_tax: number;
  coupon?: CouponTypes | null;
}

export interface TaxTypes {
  id: number;
  name: string;
  rate: number;
}

export type CouponPromoType = "limit" | "period" | "product";
export type CouponDiscountType = "fixed" | "percentage";

export interface CouponTypes {
  id: number;
  name: string;
  description: string | null;
  promo_type: CouponPromoType;
  code: string | null;
  discount_type: CouponDiscountType;
  discount_amount: number | string | null;
  discount_value?: number | string | null;
  computed_discount_amount?: number | null;
  limit: number | null;
  limit_per_user: number | null;
  available_coupons?: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplyCouponReqTypes {
  code: string;
  cart_ids?: Array<number>;
}

export interface ApplyCouponResTypes {
  data: CouponTypes;
  message?: string;
  discount_amount?: number | string | null;
  total_price?: number | string | null;
}

export interface ShippingAddressTypes {
  id: number;
  name: string;
  phone: string;
  province: ProvinceTypes;
  city: CityTypes;
  district: string;
  postal_code: string;
  address: string;
}

export interface ShippingCostTypes {
  courier: string;
  courier_name: string;
  service: string;
  service_name: string;
  cost: number;
  etd: string;
}

export interface ShippingCostReqTypes {
  destination?: number;
  weight?: number;
}

export interface CheckoutReqTypes {
  cart_ids?: Array<number>;
}

export interface DeliveryAddressTypes {
  name: string;
  phone: string;
  province: ProvinceTypes;
  city: CityTypes;
  district: string;
  postal_code: string;
  address: string;
}

export interface AddressTypes {
  name?: string;
  phone?: string;
  province?: ProvinceTypes;
  city?: CityTypes;
  district?: DistrictTypes;
  subdistrict?: SubDistrictTypes;
  zip_code?: string;
  address?: string;
}
