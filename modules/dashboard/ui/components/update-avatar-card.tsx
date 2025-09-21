"use client";

import { SubmitButton } from "@/components/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UploadInput } from "@/components/upload-input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { UploadFileResponse } from "@xixixao/uploadstuff/react";
import {
  type Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UpdateAvatarCard = ({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const t = useScopedI18n("dashboard.settings.updateAvatarCard");
  const user = usePreloadedQuery(preloadedUser);

  if (!user) {
    return null;
  }

  const userImageUrl = useQuery(
    api.files.getUrlById,
    user?.image ? { id: user.image as Id<"_storage"> } : "skip",
  );

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  const handleUpdateUserImage = async (uploaded: UploadFileResponse[]) => {
    const oldImageId = user.image;

    toast.promise(
      authClient.updateUser({
        image: (uploaded[0]?.response as { storageId: Id<"_storage"> })
          .storageId,
      }),
      {
        loading: "Updating image...",
        success: "Image updated successfully",
        error: "Failed to update image",
      },
    );

    if (oldImageId) {
      await deleteFile({ id: oldImageId as Id<"_storage"> });
    }
  };

  const handleRemoveUserImage = async () => {
    const oldImageId = user.image;

    toast.promise(
      authClient.updateUser({
        image: null,
      }),
      {
        loading: "Removing image...",
        success: "Image removed successfully",
        error: "Failed to remove image",
      },
    );

    await deleteFile({ id: oldImageId as Id<"_storage"> });
  };

  return (
    <>
      <div className="flex w-full flex-col items-start rounded-lg border border-border bg-card">
        <div className="flex w-full items-start justify-between rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">
              {t("avatar.title")}
            </h2>
            <p className="text-sm font-normal text-primary/60">
              {t("avatar.description")}
            </p>
          </div>
          <label
            className="group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95"
            htmlFor="avatar_field"
          >
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage
                alt={user.email}
                src={
                  user.image && userImageUrl
                    ? userImageUrl
                    : `https://avatar.vercel.sh/${user.email}`
                }
              />
              <AvatarFallback className="h-20 w-20 rounded-full">
                {user.name && user.name.length > 0
                  ? user.name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
              <UploadIcon className="h-6 w-6 text-secondary" />
            </div>
          </label>
          <UploadInput
            id="avatar_field"
            type="file"
            accept="image/*"
            className="peer sr-only"
            required
            tabIndex={user ? -1 : 0}
            generateUploadUrl={generateUploadUrl}
            onUploadComplete={handleUpdateUserImage}
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            {t("avatar.uploadHint")}
          </p>
          {user.image && (
            <Button
              onClick={() => {
                handleRemoveUserImage();
              }}
              size="sm"
              type="button"
              variant="secondary"
            >
              {t("avatar.resetButton")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateAvatarCard;
