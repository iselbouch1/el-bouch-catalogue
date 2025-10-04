import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Trash2, Upload } from "lucide-react";
import type { ProductImage } from "@/types";
import { toast } from "sonner";

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
  onUpload: (file: File, isCover: boolean) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  onSetCover: (imageId: string) => Promise<void>;
}

export function ImageManager({ productId, images, onUpload, onDelete, onSetCover }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    `${window.location.protocol}//${window.location.hostname}:8082`;

  const toAbsolute = (url: string) =>
    url?.startsWith("/uploads/") || url?.startsWith("/files/")
      ? `${API_BASE_URL}${url}`
      : url;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file, images.length === 0);
      toast.success("Image uploadée avec succès");
      e.target.value = "";
    } catch (error) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await onDelete(imageId);
      toast.success("Image supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      await onSetCover(imageId);
      toast.success("Image de couverture définie");
    } catch (error) {
      toast.error("Erreur lors de la définition de la couverture");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Ajouter une image</label>
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="flex-1"
          />
          <Button disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Upload..." : "Ajouter"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id || index} className="relative group">
            <img
              src={toAbsolute(image.url) || "/placeholder.svg"}
              alt={image.alt}
              className="w-full aspect-square object-cover rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {image.isCover && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-accent">Couverture</Badge>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!image.isCover && image.id && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleSetCover(image.id!)}
                  title="Définir comme couverture"
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
              {image.id && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(image.id!)}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Aucune image. Ajoutez-en une ci-dessus.
        </p>
      )}
    </div>
  );
}
