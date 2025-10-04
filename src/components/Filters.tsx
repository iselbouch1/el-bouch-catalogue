import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Category } from "@/types";

interface FiltersProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagChange: (tag: string) => void;
}

export function Filters({
  categories,
  selectedCategories,
  onCategoryChange,
  tags,
  selectedTags,
  onTagChange,
}: FiltersProps) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold">Filtres</h2>

      <Accordion type="multiple" defaultValue={["categories", "tags"]} className="w-full">
        {/* Categories Filter */}
        <AccordionItem value="categories">
          <AccordionTrigger className="hover:no-underline">Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onCategoryChange(category.id)}
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags Filter */}
        <AccordionItem value="tags">
          <AccordionTrigger className="hover:no-underline">Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => onTagChange(tag)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm font-normal cursor-pointer">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
