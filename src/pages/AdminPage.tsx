import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductListAdmin } from "@/components/admin/ProductListAdmin";
import { getAllProducts, deleteProduct } from "@/lib/adminApi";
import { useProductEvents } from "@/hooks/useProductEvents";
import type { Product } from "@/types";
import { toast } from "sonner";
import { Plus, Home } from "lucide-react";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useProductEvents(); // Listen for real-time updates

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      await deleteProduct(id);
      toast.success("Produit supprimé");
      loadProducts();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-accent">Administration</h1>
              <p className="text-muted-foreground">Gestion des produits et catégories</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Voir le site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Produits</h2>
            <p className="text-muted-foreground">
              Total: {products.length} produit(s)
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          ) : (
            <ProductListAdmin products={products} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}
