import { cn } from "@/lib/utils";
import { ArrowRightIcon, ImageIcon, CloudUploadIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p className="font-semibold text-base text-foreground">
        Drag 'n' drop some files here,
        <span className="cursor-pointer font-bold text-primary">
          or click here to select files
        </span>
      </p>
      <Button type="button" className="mt-4">
        Select files
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/30">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="font-semibold text-base">Error loading file</p>
      <p className="mt-1 text-muted-foreground text-xs ">
        Something went wrong
      </p>
      <Button className="mt-4" type="button">
        Tentar novamente <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
