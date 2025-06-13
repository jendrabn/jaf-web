import type { ProductItemTypes } from "./product";

export interface WishlistTypes {
  id: number;
  product: ProductItemTypes;
}

export interface WishlistReqTypes {
  product_id: number;
}

export interface DeleteWishlistReqTypes {
  wishlist_ids: Array<number>;
}
