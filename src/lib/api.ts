import type { Category, Product } from "@/types";
import categoriesData from "../../data/local/categories.json";
import productsData from "../../data/local/products.json";
import { supabase } from "@/integrations/supabase/client";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

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

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug, parentId: c.parent_id || undefined }));
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
  category?: string; // slug
  tags?: string[];
  visible?: boolean;
  featured?: boolean;
  page?: number;
  perPage?: number;
}): Promise<{ data: Product[]; meta: any }> {
  if (USE_MOCK) {
    const filtered = filterProducts(productsData as Product[], params);
    const sorted = filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    if (params.page && params.perPage) return paginate(sorted, params.page, params.perPage);
    return { data: sorted, meta: { total: sorted.length } };
  }

  // Base select with relations
  let query = supabase
    .from("products")
    .select(
      "id, name, slug, short_description, description, is_visible, is_featured, sort_order, specs, product_images(id, url, alt, is_cover, sort_order), product_categories(category_id), product_tags(tag)"
    )
    .order("sort_order", { ascending: true });

  if (params.visible !== undefined) query = query.eq("is_visible", params.visible);
  if (params.featured !== undefined) query = query.eq("is_featured", params.featured);

  const { data, error } = await query;
  if (error) throw error;

  const categories = await getCategories();
  const categoryId = params.category ? categories.find((c) => c.slug === params.category)?.id : undefined;

  // Transform to frontend Product shape
  const all = (data || []).map((p: any) => {
    const images = (p.product_images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || p.name,
      isCover: img.is_cover || false,
    }));
    const categoryIds = (p.product_categories || []).map((pc: any) => pc.category_id);
    const tags = (p.product_tags || []).map((t: any) => t.tag);
    const prod: Product = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.short_description || undefined,
      description: p.description || undefined,
      categoryIds,
      tags,
      isVisible: p.is_visible,
      isFeatured: p.is_featured,
      sortOrder: p.sort_order || 0,
      images,
      specs: p.specs || {},
    };
    return prod;
  });

  // Client-side filters for search, tags, category slug
  let filtered = filterProducts(all, {
    search: params.search,
    tags: params.tags,
    visible: params.visible,
    featured: params.featured,
    category: categoryId,
  } as any);

  if (params.page && params.perPage) return paginate(filtered, params.page, params.perPage);
  return { data: filtered, meta: { total: filtered.length } };
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK) {
    const products = productsData as Product[];
    return products.find((p) => p.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, short_description, description, is_visible, is_featured, sort_order, specs, product_images(id, url, alt, is_cover, sort_order), product_categories(category_id), product_tags(tag)"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;

  const prodList = (
    await getProducts({ visible: undefined })
  ).data; // reuse mapping
  return prodList.find((p) => p.slug === slug) || null;
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
