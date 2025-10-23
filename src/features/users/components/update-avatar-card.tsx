"use client";

import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { UploadButton } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { useUpdateProfileAvatar } from "../hooks/use-update-profile";

type UpdateAvatarCardProps = {
  initialImage?: string | null;
};

const UpdateAvatarCard = ({
  initialImage: _initialImage,
}: UpdateAvatarCardProps) => {
  const t = useScopedI18n("dashboard.settings.updateAvatarCard");
  const { data: session } = authClient.useSession();
  const updateAvatar = useUpdateProfileAvatar();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!session?.user) {
    return null;
  }

  const currentImage = session.user.image;

  const handleRemoveAvatar = async () => {
    if (!currentImage) {
      return;
    }

    setIsRemoving(true);

    try {
      // Update avatar to null (which will delete old image via updateAvatar)
      await updateAvatar.mutateAsync({
        image: null,
        oldImage: currentImage,
      });

      // Force page reload after mutation completes
      location.reload();
    } catch {
      toast.error(t("removeToast.error"));
      setIsRemoving(false);
    }
  };

  const handleUploadComplete = async (res: typeof res | undefined) => {
    if (!res || res.length === 0) {
      toast.error("No file uploaded");
      setIsUploading(false);
      return;
    }

    const newImageUrl = res[0].url;

    try {
      await updateAvatar.mutateAsync({
        image: newImageUrl,
        oldImage: currentImage || undefined,
      });

      // Force page reload after mutation completes
      location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`${t("uploadToast.error")}: ${errorMessage}`);
      setIsUploading(false);
    }
  };

  const getDisplayImage = () => currentImage || undefined;

  const getAvatarFallback = () =>
    session.user.name && session.user.name.length > 0
      ? session.user.name.charAt(0).toUpperCase()
      : session.user.email?.charAt(0).toUpperCase();

  return (
    <div className="flex w-full flex-col items-start rounded-lg border border-border bg-card">
      <div className="flex w-full items-start justify-between rounded-lg p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-xl">{t("title")}</h2>
          <p className="font-normal text-sm">{t("description")}</p>
        </div>
        <div className="group relative inline-flex cursor-pointer overflow-hidden rounded-full transition active:scale-95">
          <Avatar className="h-20 w-20 rounded-full">
            <AvatarImage
              alt={session.user.email || ""}
              src={getDisplayImage()}
            />
            <AvatarFallback className="h-20 w-20 rounded-full">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
            <UploadIcon className="h-6 w-6 text-secondary" />
          </div>
          <div className="absolute inset-0 z-20">
            {isUploading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner className="size-6" />
              </div>
            ) : (
              <UploadButton
                appearance={{
                  button:
                    "border-0 bg-transparent p-0 ring-0 text-transparent hover:bg-transparent focus-visible:ring-0 h-full w-full cursor-pointer text-[0px]",
                  container: "h-full w-full",
                  allowedContent: "hidden",
                }}
                className="ut-button:h-full ut-button:w-full ut-button:cursor-pointer ut-button:border-0 ut-button:bg-transparent ut-button:p-0 ut-button:text-[0px] ut-button:text-transparent ut-button:ring-0 ut-button:hover:bg-transparent ut-button:focus-visible:ring-0"
                endpoint="imageUploader"
                onBeforeUploadBegin={(files) => {
                  setIsUploading(true);
                  return files;
                }}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                  setIsUploading(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-border border-t bg-secondary px-6">
        <p className="font-normal text-sm">{t("uploadHint")}</p>
        {currentImage && (
          <Button
            disabled={isRemoving || updateAvatar.isPending}
            onClick={handleRemoveAvatar}
            size="sm"
            type="button"
            variant="outline"
          >
            {isRemoving || updateAvatar.isPending ? (
              <>
                <Spinner className="size-4" />
                {t("resetButton")}
              </>
            ) : (
              t("resetButton")
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpdateAvatarCard;
