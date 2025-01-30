import { CartItemTypes } from "./cart";
import { BankTypes, EwalletTypes } from "./payment-method";
import { CityTypes, ProvinceTypes } from "./region";

export interface CheckoutTypes {
  shipping_address: AddressTypes;
  carts: Array<CartItemTypes>;
  shipping_methods: Array<ShippingCostTypes>;
  payment_methods: {
    bank: Array<BankTypes>;
    ewallet: Array<EwalletTypes>;
  };
  total_quantity: number;
  total_weight: number;
  total_price: number;
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
  name: string;
  phone: string;
  province?: ProvinceTypes;
  city?: CityTypes;
  district: string;
  postal_code: string;
  address: string;
}
