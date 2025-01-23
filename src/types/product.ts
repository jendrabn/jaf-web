export interface ProductCategoryTypes {
  id: number;
  name: string;
  slug: string;
}

export interface ProductBrandTypes {
  id: number;
  name: string;
  slug: string;
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

export interface ProductItemTypes {
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
}

export interface ProductDetailTypes {
  id: number;
  name: string;
  slug: string;
  images: Array<string>;
  category: ProductCategoryTypes;
  description: string;
  brand: ProductBrandTypes;
  sex: number;
  price: number;
  stock: number;
  weight: number;
  sold_count: number;
  is_wishlist: boolean;
}
