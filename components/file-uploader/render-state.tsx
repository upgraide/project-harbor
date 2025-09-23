import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";
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
