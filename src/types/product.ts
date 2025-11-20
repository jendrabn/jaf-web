import type { RatingTypes } from "./order";

export interface ProductCategoryTypes {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ProductBrandTypes {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ProductParamsTypes {
  page?: number;
  search?: string;
  sort_by?: "newest" | "oldest" | "sales" | "expensive" | "cheapest";
  category_id?: number;
  brand_id?: number;
  sex?: 1 | 2 | 3;
  min_price?: number;
  max_price?: number;
}

export interface ProductDiscountTypes {
  id: number;
  name: string;
  description: string;
  promo_type: string;
  code: string | null;
  discount_type: "fixed" | "percentage";
  discount_amount: number;
  limit: number | null;
  limit_per_user: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  available_coupons?: number | null;
  pivot?: { product_id: number; coupon_id: number } | null;
}

export interface ProductFlashSaleMeta {
  flash_sale_price?: number | null;
  flash_sale_end_at?: string | null;
  final_price?: number | null;
  is_in_flash_sale?: boolean;
  flash_price?: number | null;
  flash_price_display?: string | null;
  flash_stock?: number | null;
  flash_sold?: number | null;
  flash_stock_remaining?: number | null;
  max_qty_per_user?: number | null;
  is_flash_price_masked?: boolean;
}

export interface ProductItemTypes extends ProductFlashSaleMeta {
  id: number;
  name: string;
  slug: string;
  image: string;
  category: ProductCategoryTypes;
  brand: ProductBrandTypes;
  sex?: 1 | 2 | 3;
  price: number;
  stock: number;
  weight: number;
  sold_count: number;
  is_wishlist: boolean;
  rating_avg: number;
  discount?: ProductDiscountTypes | null;
  price_after_discount?: number | null;
  is_discounted?: boolean;
  discount_in_percent?: number | null;
}

export interface ProductDetailTypes extends ProductFlashSaleMeta {
  id: number;
  name: string;
  slug: string;
  images: string[];
  category: ProductCategoryTypes;
  description: string;
  brand: ProductBrandTypes;
  sex: number;
  price: number;
  stock: number;
  weight: number;
  sold_count: number;
  is_wishlist: boolean;
  rating_avg: number;
  discount?: ProductDiscountTypes | null;
  price_after_discount?: number | null;
  is_discounted?: boolean;
  discount_in_percent?: number | null;
  ratings: RatingTypes[];
  sku: string;
}
