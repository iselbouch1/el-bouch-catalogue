import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const coverImage = product.images.find((img) => img.isCover) || product.images[0];
  const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL as string) ||
    `${window.location.protocol}//${window.location.hostname}:8082`;
  const toAbsolute = (u?: string) =>
    u && (u.startsWith("/uploads/") || u.startsWith("/files/"))
      ? `${API_BASE_URL}${u}`
      : u;
  const imgSrc = toAbsolute(coverImage?.url);

  return (
    <Link
      to={`/produits/${product.slug}`}
      className="group block rounded-lg overflow-hidden bg-card shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={coverImage?.alt || product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-racing text-accent-foreground shadow-racing">
              Nouveauté
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
