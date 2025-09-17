import { Button } from "@harbor-app/ui/components/button";
import { ImageOffIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

interface ImageGridProps {
  images: string[];
  opportunityName: string;
  onDeleteImage?: (imageUrl: string) => void;
  onAddImage?: () => void;
  showAddButton?: boolean;
}

export const ImageGrid = ({
  images,
  opportunityName,
  onDeleteImage,
  onAddImage,
  showAddButton = true,
}: ImageGridProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ImageOffIcon className="size-4" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No images uploaded
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add images to showcase this opportunity
        </p>
        {showAddButton && onAddImage && (
          <Button onClick={onAddImage} size="sm">
            Add Image
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all duration-200 hover:shadow-md hover:scale-105"
          key={image}
        >
          <Image
            alt={`${opportunityName} - Image ${index + 1}`}
            className="object-cover transition-transform duration-200 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={image}
          />
          {onDeleteImage && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                className="size-8 p-0"
                onClick={() => onDeleteImage(image)}
                size="sm"
                variant="destructive"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
