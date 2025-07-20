export interface ValidationErrorTypes {
  message: string;
  errors?: { [key: string]: string };
  status: number;
}

export interface PageTypes {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface NoContentTypes {
  data: true;
}
