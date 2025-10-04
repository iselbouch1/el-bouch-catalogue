import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { Filters } from "@/components/Filters";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts, getCategoryBySlug, getCategories, getAllTags } from "@/lib/api";
import type { Product, Category } from "@/types";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCategoryBySlug(slug!),
      getCategories(),
      getAllTags(),
    ]).then(([cat, cats, tags]) => {
      setCategory(cat);
      setCategories(cats);
      setAllTags(tags);
      if (cat) {
        setSelectedCategories([cat.id]);
      }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (category) {
      document.title = `${category.name} - EL Bouch Auto`;
    }
  }, [category]);

  useEffect(() => {
    if (selectedCategories.length === 0 && !slug) return;

    getProducts({
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      visible: true,
    }).then((data) => {
      let sorted = [...data.data];
      if (sortBy === "name") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "recent") {
        sorted.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
      }
      setProducts(sorted);
    });
  }, [selectedCategories, selectedTags, sortBy, slug]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [categoryId]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    if (category) {
      setSelectedCategories([category.id]);
    } else {
      setSelectedCategories([]);
    }
    setSelectedTags([]);
  };

  const hasActiveFilters =
    (category && selectedCategories.length > 1) ||
    (!category && selectedCategories.length > 0) ||
    selectedTags.length > 0;

  const filtersContent = (
    <Filters
      categories={categories}
      selectedCategories={selectedCategories}
      onCategoryChange={handleCategoryChange}
      tags={allTags}
      selectedTags={selectedTags}
      onTagChange={handleTagChange}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category?.name || "Tous les produits"}</h1>
        <p className="text-muted-foreground">
          {products.length} {products.length > 1 ? "produits" : "produit"}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            {filtersContent}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="mt-6 space-y-4">
                  {filtersContent}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Alphabétique</SelectItem>
                <SelectItem value="recent">Plus récent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductSkeletonGrid count={9} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
