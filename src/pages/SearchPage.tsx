import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState(query);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = query ? `Recherche : ${query} - EL Bouch Auto` : "Recherche - EL Bouch Auto";
  }, [query]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    setLoading(true);
    getProducts({ search: query, visible: true }).then((data) => {
      setProducts(data.data);
      setLoading(false);
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Rechercher un produit</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit…"
            className="pl-12 h-12 text-lg"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </form>
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Résultats pour <span className="font-semibold text-foreground">"{query}"</span> :{" "}
            {products.length} {products.length > 1 ? "produits trouvés" : "produit trouvé"}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductSkeletonGrid count={8} />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun produit trouvé pour "{query}"
          </p>
        </div>
      ) : null}
    </div>
  );
}
