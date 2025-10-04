import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductListAdminProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductListAdmin({ products, onDelete }: ProductListAdminProps) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    `${window.location.protocol}//${window.location.hostname}:8082`;

  const toAbsolute = (url?: string) =>
    url && (url.startsWith("/uploads/") || url.startsWith("/files/"))
      ? `${API_BASE_URL}${url}`
      : url;

  return (
    <div className="grid gap-4">
      {products.map((product) => {
        const coverImage = product.images.find((img) => img.isCover) || product.images[0];
        const imgSrc = toAbsolute(coverImage?.url);

        return (
          <div
            key={product.id}
            className="bg-card rounded-lg p-4 shadow-card flex gap-4 items-center"
          >
            <img
              src={imgSrc || "/placeholder.svg"}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {product.shortDescription}
              </p>
              <div className="flex gap-2 mt-2">
                {product.isFeatured && (
                  <Badge variant="secondary">Nouveauté</Badge>
                )}
                {!product.isVisible && (
                  <Badge variant="outline">Masqué</Badge>
                )}
                <Badge variant="outline">{product.images.length} photos</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/admin/products/${product.id}`}>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
