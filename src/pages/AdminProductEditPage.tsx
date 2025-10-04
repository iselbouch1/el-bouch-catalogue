import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageManager } from "@/components/admin/ImageManager";
import {
  getProduct,
  updateProduct,
  uploadImage,
  deleteImage,
  setCoverImage,
  getAllCategories,
} from "@/lib/adminApi";
import type { Product, Category } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const [productData, categoriesData] = await Promise.all([
        getProduct(id),
        getAllCategories(),
      ]);
      setProduct(productData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!product || !id) return;

    setSaving(true);
    try {
      await updateProduct(id, {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        categoryIds: product.categoryIds,
        tags: product.tags || [],
        isVisible: product.isVisible,
        isFeatured: product.isFeatured,
        sortOrder: product.sortOrder || 0,
        specs: product.specs || {},
      });
      toast.success("Produit mis à jour");
      navigate("/admin");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, isCover: boolean) => {
    if (!id) return;
    await uploadImage(id, file, isCover);
    await loadData(); // Reload to get updated images
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return;
    await deleteImage(id, imageId);
    await loadData();
  };

  const handleSetCover = async (imageId: string) => {
    if (!id) return;
    await setCoverImage(id, imageId);
    await loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Produit introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-accent">Modifier le produit</h1>
                <p className="text-muted-foreground">{product.name}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nom du produit</label>
              <Input
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description courte</label>
              <Input
                value={product.shortDescription || ""}
                onChange={(e) =>
                  setProduct({ ...product, shortDescription: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description complète</label>
              <Textarea
                value={product.description || ""}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={5}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={product.isVisible}
                  onCheckedChange={(checked) =>
                    setProduct({ ...product, isVisible: checked as boolean })
                  }
                />
                <label className="text-sm">Visible sur le site</label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={product.isFeatured}
                  onCheckedChange={(checked) =>
                    setProduct({ ...product, isFeatured: checked as boolean })
                  }
                />
                <label className="text-sm">Produit en vedette</label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Images du produit</h2>
            <ImageManager
              productId={id!}
              images={product.images}
              onUpload={handleUpload}
              onDelete={handleDeleteImage}
              onSetCover={handleSetCover}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
