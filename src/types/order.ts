import type { ProductItemTypes } from "./product";

export interface OrderItemTypes {
  id: number;
  product: ProductItemTypes;
  name: string;
  price: number;
  price_before_discount?: number | null;
  price_after_discount?: number | null;
  discount_in_percent?: number | null;
  weight: number;
  quantity: number;
  rating: RatingTypes | null;
}

export interface OrderTypes {
  id: number;
  items: Array<OrderItemTypes>;
  status: string;
  total_amount: number;
  payment_due_date: string;
  created_at: string;
  // Tambahan untuk identifikasi metode pembayaran pada list pesanan
  payment?: {
    method: string;
    info?: PaymentInfoTypes;
    status?: string;
  };
}

export interface OrderReqTypes {
  cart_ids?: number[];
  shipping_address: {
    name?: string;
    phone?: string;
    province_id?: number;
    city_id?: number;
    district_id?: number;
    subdistrict_id?: number;
    zip_code?: string;
    address?: string;
  };
  shipping_courier?: string;
  shipping_service?: string;
  payment_method?: string;
  bank_id?: number;
  ewallet_id?: number;
  note?: string;
  coupon_code?: string;
}

export interface OrderParamsTypes {
  page?: number;
  status?:
    | "pending_payment"
    | "pending"
    | "processing"
    | "on_delivery"
    | "completed"
    | "cancelled";
  sort_by?: "newest" | "oldest";
}

export interface OrderDetailTypes {
  id: number;
  items: Array<OrderItemTypes>;
  invoice: {
    id: number;
    number: string;
    amount: number;
    due_date: string;
    status: string;
  };
  payment: {
    id: number;
    method: string;
    info: PaymentInfoTypes;
    amount: number;
    status: string;
  };
  shipping_address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postal_code: string;
    address: string;
  };
  shipping: {
    id: number;
    courir: string;
    courier_name: string;
    service: string;
    service_name: string;
    etd: string;
    tracking_number: string;
    status: string;
  };
  note: string;
  cancel_reason: string;
  status: string;
  total_quantity: number;
  total_weight: number;
  total_price: number;
  tax_amount: number;
  tax_name: string;

  // Tambahan untuk biaya payment gateway (opsional)
  gateway_fee?: number;
  gateway_fee_name?: string;

  discount: number;
  discount_name: string;
  shipping_cost: number;
  total_amount: number;
  payment_due_date: string;
  confirmed_at: string;
  shipped_at: string;
  completed_at: string;
  cancelled_at: string;
  created_at: string;
}

export interface CheckoutTypes {
  items: Array<OrderItemTypes>;
  shipping_address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postal_code: string;
    address: string;
  };
  shipping_cost: number;
  total_amount: number;
}

export interface PaymentInfoTypes {
  name?: string;
  code?: string;
  account_name?: string;
  account_number?: string;
  account_username?: string;
  phone?: string;
  client_key?: string;
  snap_token?: string;
  redirect_url?: string;
}

export interface ConfirmPaymentReqTypes {
  name?: string;
  account_name?: string;
  account_number?: string;
  account_username?: string;
  phone?: string;
}

export interface OrderSuccessTypes {
  id: number;
  total_amount: number;
  payment_method: string;
  payment_info: {
    name: string;
    code: string;
    account_name: number;
    account_number: string;
  };
  payment_due_date: string;
  created_at: string;
}

export interface RatingTypes {
  order_item_id: number;
  rating: number;
  comment: string;
  is_anonymous: boolean;
  username: string;
  created_at: string;
}

export interface RatingReqTypes {
  order_item_id: number;
  rating: number;
  comment: string;
  is_anonymous: boolean;
}
