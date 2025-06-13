import type { ProductItemTypes } from "./product";

export interface OrderItemTypes {
  id: number;
  product: ProductItemTypes;
  name: string;
  price: number;
  weight: number;
  quantity: number;
}

export interface OrderTypes {
  id: number;
  items: Array<OrderItemTypes>;
  status: string;
  total_amount: number;
  payment_due_date: string;
  created_at: string;
}

export interface OrderReqTypes {
  cart_ids?: number[];
  shipping_address: {
    name?: string;
    phone?: string;
    city_id?: number;
    district?: string;
    postal_code?: string;
    address?: string;
  };
  shipping_courier?: "jne" | "pos" | "tiki";
  shipping_service?: string;
  payment_method?: "bank" | "ewallet";
  bank_id?: number;
  ewallet_id?: number;
  notes?: string;
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
  notes: string;
  cancel_reason: string;
  status: string;
  total_quantity: number;
  total_weight: number;
  total_price: number;
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

export interface OrderSuccessTypes {
  id: number;
  total_amount: number;
  payment_method: string;
  payment_info: PaymentInfoTypes;
  payment_due_date: string;
  created_at: string;
}

export interface PaymentInfoTypes {
  name?: string;
  code?: string;
  account_name?: string;
  account_number?: string;
  account_username?: string;
  phone?: string;
}

export interface ConfirmPaymentReqTypes {
  name?: string;
  account_name?: string;
  account_number?: string;
  account_username?: string;
  phone?: string;
}
