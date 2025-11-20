export const ORDER_STATUSES: Record<string, string> = {
  pending_payment: "Pending Payment",
  pending: "Pending",
  processing: "Processing",
  on_delivery: "On Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: "warning",
  pending: "warning",
  processing: "info",
  on_delivery: "info",
  completed: "success",
  cancelled: "danger",
};

export const SEXS: Record<number, string> = {
  1: "Male",
  2: "Female",
  3: "Unisex",
};

export const PAYMENT_METHOD_BANK = "bank";
export const PAYMENT_METHOD_EWALLET = "ewallet";
export const PAYMENT_METHOD_GATEWAY = "gateway";

export const KEY_SELECTED_CART_IDS = "SELECTED_CART_IDS";

export const QUERY_KEYS = {
  USER: "user",
  PRODUCTS: "products",
  PRODUCT: "product",
  FLASH_SALES: "flash_sales",
  PRODUCT_CATEGORIES: "product_categories",
  PRODUCT_BRANDS: "product_brands",
  RELATED_PRODUCTS: "related_products",
  BLOG_CATEGORIES: "blog_categories",
  BLOG_TAGS: "blog_tags",
  BLOGS: "blogs",
  BLOG: "blog",
  CARTS: "carts",
  WISHLISTS: "wishlists",
  LANDING: "landing",
  ORDERS: "orders",
  ORDER: "order",
  PROVINCES: "provinces",
  CITIES: "cities",
  DISTRICTS: "districts",
  SUBDISTRICTS: "subdistricts",
};
