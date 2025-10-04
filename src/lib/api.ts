import type { Category, Product, ApiResponse } from "@/types";
import categoriesData from "../../data/local/categories.json";
import productsData from "../../data/local/products.json";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";

/**
 * Generic fetch wrapper for API calls
 */
async function fetchJson<T>(path: string, params?: URLSearchParams): Promise<ApiResponse<T>> {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Filter products based on search parameters
 */
function filterProducts(
  products: Product[],
  params: {
    search?: string;
    category?: string;
    tags?: string[];
    visible?: boolean;
    featured?: boolean;
  }
): Product[] {
  let filtered = [...products];

  if (params.visible !== undefined) {
    filtered = filtered.filter((p) => p.isVisible === params.visible);
  }

  if (params.featured !== undefined) {
    filtered = filtered.filter((p) => p.isFeatured === params.featured);
  }

  if (params.category) {
    filtered = filtered.filter((p) => p.categoryIds.includes(params.category!));
  }

  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((p) =>
      params.tags!.some((tag) => p.tags?.includes(tag))
    );
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.shortDescription?.toLowerCase().includes(searchLower) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}

/**
 * Paginate results
 */
function paginate<T>(items: T[], page: number, perPage: number): { data: T[]; meta: any } {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const data = items.slice(start, end);

  return {
    data,
    meta: {
      page,
      perPage,
      total: items.length,
      totalPages: Math.ceil(items.length / perPage),
    },
  };
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    return categoriesData as Category[];
  }

  const response = await fetchJson<Category[]>("/api/v1/categories");
  return response.data;
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

/**
 * Get products with filters
 */
export async function getProducts(params: {
  search?: string;
  category?: string;
  tags?: string[];
  visible?: boolean;
  featured?: boolean;
  page?: number;
  perPage?: number;
}): Promise<{ data: Product[]; meta: any }> {
  if (USE_MOCK) {
    const filtered = filterProducts(productsData as Product[], params);
    const sorted = filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    if (params.page && params.perPage) {
      return paginate(sorted, params.page, params.perPage);
    }

    return { data: sorted, meta: { total: sorted.length } };
  }

  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.tags) searchParams.set("tags", params.tags.join(","));
  if (params.visible !== undefined) searchParams.set("visible", params.visible ? "1" : "0");
  if (params.featured !== undefined) searchParams.set("featured", params.featured ? "1" : "0");
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.perPage) searchParams.set("per_page", params.perPage.toString());

  const response = await fetchJson<Product[]>("/api/v1/products", searchParams);
  return { data: response.data, meta: response.meta };
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK) {
    const products = productsData as Product[];
    return products.find((p) => p.slug === slug) || null;
  }

  try {
    const response = await fetchJson<Product>(`/api/v1/products/${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Get all unique tags from products
 */
export async function getAllTags(): Promise<string[]> {
  const { data: products } = await getProducts({ visible: true });
  const tagsSet = new Set<string>();
  products.forEach((p) => p.tags?.forEach((tag) => tagsSet.add(tag)));
  return Array.from(tagsSet).sort();
}
