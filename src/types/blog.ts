export interface BlogCategoryTypes {
  id: number;
  name: string;
  slug: string;
  blogs_count: number;
}

export interface BlogTagTypes {
  id: number;
  name: string;
  slug: string;
  blogs_count: number;
}

export interface BlogItemTypes {
  id: number;
  title: string;
  slug: string;
  content_thumbnail: string;
  min_read: number;
  featured_image: string;
  views_count: number;
  author: string;
  category: BlogCategoryTypes;
  created_at: string;
}

export interface BlogDetailTypes {
  id: number;
  title: string;
  slug: string;
  content: string;
  min_read: number;
  featured_image: string;
  featured_image_description: string;
  views_count: number;
  author: string;
  category: BlogCategoryTypes;
  tags: Array<BlogTagTypes>;
  created_at: string;
}

export interface BlogParamsTypes {
  page?: number;
  search?: string;
  sort_by?: "newest" | "oldest" | "views";
  category_id?: number;
  tag_id?: number;
}
