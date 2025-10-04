export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  isCover?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categoryIds: string[];
  tags?: string[];
  isVisible: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  images: ProductImage[];
  specs?: Record<string, string | number | boolean>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
  };
}
