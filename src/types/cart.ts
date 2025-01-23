import { ProductItemTypes } from "./product";

export interface CartItemTypes {
  id: number;
  product: ProductItemTypes;
  quantity: number;
}

export interface CartReqTypes {
  product_id: number;
  quantity: number;
}

export interface deleteReqTypes {
  cart_ids: Array<number>;
}

export interface updateReqTypes {
  quantity: number;
}
