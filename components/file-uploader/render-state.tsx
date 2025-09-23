import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ImageIcon,
  CloudUploadIcon,
  Loader,
  TrashIcon,
  CheckIcon,
} from "lucide-react";
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

export function RenderUploadedState({
  isDeleting,
  handleRemoveFile,
}: {
  isDeleting?: boolean;
  handleRemoveFile?: () => void;
}) {
  return (
    <div>
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-500/30">
          <CheckIcon className={cn("size-6 text-green-500")} />
        </div>
        <p className="font-semibold text-base">Files Uploaded</p>
        <p className="mt-1 text-muted-foreground text-xs ">
          File uploaded with success
        </p>
      </div>
      <Button
        variant="destructive"
        size="icon"
        type="button"
        disabled={isDeleting}
        className={cn(
          "absolute top-4 right-4",
          isDeleting && "cursor-not-allowed opacity-50",
        )}
        onClick={handleRemoveFile}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <TrashIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-muted-foreground text-sm">{progress}%</p>

      <p className="mt-2 font-medium text-foreground text-sm">Uploading...</p>
    </div>
  );
}
