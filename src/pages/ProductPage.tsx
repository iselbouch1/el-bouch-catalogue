import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { getProductBySlug, getProducts, getCategoryBySlug } from "@/lib/api";
import type { Product, Category } from "@/types";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getProductBySlug(slug).then(async (prod) => {
      if (prod) {
        setProduct(prod);
        document.title = `${prod.name} - EL Bouch Auto`;

        // Load category
        if (prod.categoryIds.length > 0) {
          const cats = await Promise.all(
            prod.categoryIds.map((id) =>
              getCategoryBySlug(id).catch(() => null)
            )
          );
          const firstCat = cats.find((c) => c !== null);
          if (firstCat) setCategory(firstCat);

          // Load related products
          const related = await getProducts({
            category: prod.categoryIds[0],
            visible: true,
          });
          setRelatedProducts(
            related.data.filter((p) => p.id !== prod.id).slice(0, 4)
          );
        }
      }
      setLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Lien copié dans le presse-papier");
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-secondary rounded-lg" />
            <div className="space-y-4">
              <div className="h-10 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-accent transition-colors">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <Link
              to={`/categories/${category.slug}`}
              className="hover:text-accent transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Button onClick={handleShare} variant="outline" className="w-full md:w-auto">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Caractéristiques</h2>
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-border last:border-0"
                  >
                    <dt className="font-medium capitalize">{key}</dt>
                    <dd className="text-muted-foreground">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Produits associés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
