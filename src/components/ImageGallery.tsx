import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ProductImage } from "@/types";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const mainImage = images[selectedImage] || images[0];
  const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL as string) ||
    `${window.location.protocol}//${window.location.hostname}:8082`;
  const toAbsolute = (u: string) => (u?.startsWith("/uploads/") ? `${API_BASE_URL}${u}` : u);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-lg overflow-hidden bg-secondary cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={toAbsolute(mainImage.url) || "/placeholder.svg"}
          alt={mainImage.alt || productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden bg-secondary border-2 transition-all ${
                selectedImage === index
                  ? "border-accent shadow-racing"
                  : "border-transparent hover:border-muted"
              }`}
            >
              <img
                src={toAbsolute(image.url) || "/placeholder.svg"}
                alt={image.alt || `${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0">
          <img
            src={toAbsolute(mainImage.url) || "/placeholder.svg"}
            alt={mainImage.alt || productName}
            className="w-full h-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
