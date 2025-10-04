import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { getProducts, getCategories } from "@/lib/api";
import type { Product, Category } from "@/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "EL Bouch Auto - Accessoires & Décorations Automobiles";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Découvrez notre catalogue d'accessoires et décorations automobiles premium : éclairage LED, jantes sport, sièges racing, et plus encore."
      );
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, visible: true }),
      getCategories(),
    ]).then(([productsData, categoriesData]) => {
      setFeaturedProducts(productsData.data.slice(0, 8));
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-car.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            EL Bouch Auto
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Accessoires & Décorations Automobiles Premium
          </p>
          <Button
            asChild
            size="lg"
            variant="racing"
            className="animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link to="#nouveautes">
              Découvrir
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Products */}
        <section id="nouveautes" className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Nouveautés</h2>
              <p className="text-muted-foreground">Découvrez nos derniers produits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <ProductSkeletonGrid count={8} />
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Nos Catégories</h2>
            <p className="text-muted-foreground">Explorez notre gamme complète</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative h-48 rounded-lg overflow-hidden bg-gradient-carbon shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
