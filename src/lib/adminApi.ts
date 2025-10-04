import type { Product, Category } from "@/types";
import { supabase } from "@/integrations/supabase/client";

function toProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.short_description || undefined,
    description: p.description || undefined,
    categoryIds: (p.product_categories || []).map((pc: any) => pc.category_id),
    tags: (p.product_tags || []).map((t: any) => t.tag),
    isVisible: p.is_visible,
    isFeatured: p.is_featured,
    sortOrder: p.sort_order || 0,
    images: (p.product_images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || p.name,
      isCover: img.is_cover || false,
    })),
    specs: p.specs || {},
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, short_description, description, is_visible, is_featured, sort_order, specs, product_images(id, url, alt, is_cover, sort_order), product_categories(category_id), product_tags(tag)"
    )
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(toProduct);
}

export async function getProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, short_description, description, is_visible, is_featured, sort_order, specs, product_images(id, url, alt, is_cover, sort_order), product_categories(category_id), product_tags(tag)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) throw error || new Error("Product not found");
  return toProduct(data);
}

export async function updateProduct(id: string, productData: any): Promise<Product> {
  const { name, shortDescription, description, categoryIds, tags, isVisible, isFeatured, sortOrder, specs } = productData;

  const { data: up, error: upErr } = await supabase
    .from("products")
    .update({
      name,
      short_description: shortDescription,
      description,
      is_visible: isVisible,
      is_featured: isFeatured,
      sort_order: sortOrder,
      specs,
    })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (upErr || !up) throw upErr || new Error("Update failed");

  // Update categories
  await supabase.from("product_categories").delete().eq("product_id", id);
  if (Array.isArray(categoryIds) && categoryIds.length) {
    await supabase.from("product_categories").insert(
      categoryIds.map((cid: string) => ({ product_id: id, category_id: cid }))
    );
  }

  // Update tags
  await supabase.from("product_tags").delete().eq("product_id", id);
  if (Array.isArray(tags) && tags.length) {
    await supabase.from("product_tags").insert(
      tags.map((tag: string) => ({ product_id: id, tag }))
    );
  }

  return getProduct(id);
}

export async function deleteProduct(id: string): Promise<void> {
  await supabase.from("products").delete().eq("id", id);
}

export async function uploadImage(productId: string, file: File, isCover: boolean = false): Promise<void> {
  const path = `${productId}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
  const url = pub.publicUrl;

  if (isCover) {
    await supabase.from("product_images").update({ is_cover: false }).eq("product_id", productId);
  }

  await supabase.from("product_images").insert({
    product_id: productId,
    url,
    alt: file.name,
    is_cover: !!isCover,
  });
}

export async function deleteImage(productId: string, imageId: string): Promise<void> {
  // Get image to remove file too
  const { data: img } = await supabase.from("product_images").select("id, url").eq("id", imageId).maybeSingle();
  if (img?.url) {
    const prefix = "/storage/v1/object/public/product-images/";
    const idx = img.url.indexOf(prefix);
    if (idx !== -1) {
      const storagePath = img.url.substring(idx + prefix.length);
      await supabase.storage.from("product-images").remove([storagePath]);
    }
  }
  await supabase.from("product_images").delete().eq("id", imageId).eq("product_id", productId);
}

export async function setCoverImage(productId: string, imageId: string): Promise<void> {
  await supabase.from("product_images").update({ is_cover: false }).eq("product_id", productId);
  await supabase.from("product_images").update({ is_cover: true }).eq("id", imageId).eq("product_id", productId);
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug, parentId: c.parent_id || undefined }));
}
