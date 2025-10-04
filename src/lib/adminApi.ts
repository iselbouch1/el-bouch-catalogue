import type { Product, Category } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:8082`;

export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products?visible=0`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.data;
}

export async function getProduct(id: string): Promise<Product> {
  // Fetch all products and filter by ID since backend only has slug-based endpoint
  const response = await fetch(`${API_BASE_URL}/api/v1/products?visible=0`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  const product = data.data.find((p: Product) => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function updateProduct(id: string, productData: any): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

export async function uploadImage(productId: string, file: File, isCover: boolean = false): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cover", isCover.toString());

  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload image");
}

export async function deleteImage(productId: string, imageId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images/${imageId}/delete`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to delete image");
}

export async function setCoverImage(productId: string, imageId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images/${imageId}/cover`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to set cover image");
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}
