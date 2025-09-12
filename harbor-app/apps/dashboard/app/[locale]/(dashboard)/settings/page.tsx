"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { username } from "@harbor-app/backend/convex/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@harbor-app/ui/components/avatar";
import { Input } from "@harbor-app/ui/components/input";
import { SubmitButton } from "@harbor-app/ui/components/submit-button";
import { UploadInput } from "@harbor-app/ui/components/upload-input";
import { useForm } from "@tanstack/react-form";
import type { UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useMutation, useQuery } from "convex/react";
import { Upload } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

export default function DashboardSettings() {
  const t = useScopedI18n("settings");
  const user = useQuery(api.users.getUser);
  const updateUserImage = useMutation(api.users.updateUserImage);
  const updateUsername = useMutation(api.users.updateUsername);
  const removeUserImage = useMutation(api.users.removeUserImage);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  // Trasnitions
  const [removeUserImagePending, startRemoveUserImageTransition] =
    useTransition();
  const [updateUsernamePending, startUpdateUsernameTransition] =
    useTransition();

  const handleUpdateUserImage = async (uploaded: UploadFileResponse[]) => {
    await updateUserImage({
      imageId: (uploaded[0]?.response as { storageId: Id<"_storage"> })
        .storageId,
    });
  };

  const handleUploadStart = (uploadPromise: Promise<UploadFileResponse[]>) => {
    const fullUploadPromise = uploadPromise.then(async (uploaded) => {
      await handleUpdateUserImage(uploaded);
    });

    toast.promise(fullUploadPromise, {
      loading: t("handleUpdateUserImage.toast.loading"),
      success: t("handleUpdateUserImage.toast.success"),
      error: t("handleUpdateUserImage.toast.error"),
    });
  };

  const usernameForm = useForm({
    defaultValues: {
      username: user?.name || "",
    },
    onSubmit: async ({ value }) => {
      await handleUpdateUsername(value.username);
    },
  });

  async function handleUpdateUsername(username: string) {
    const updatePromise = new Promise<void>((resolve, reject) => {
      startUpdateUsernameTransition(async () => {
        try {
          await updateUsername({ username: username || "" });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    toast.promise(updatePromise, {
      loading: t("handleUpdateUsername.toast.loading"),
      success: t("handleUpdateUsername.toast.success"),
      error: t("handleUpdateUsername.toast.error"),
    });
  }

  async function hadleRemoveUserImage() {
    const removePromise = new Promise<void>((resolve, reject) => {
      startRemoveUserImageTransition(async () => {
        try {
          await removeUserImage();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    toast.promise(removePromise, {
      loading: t("handleRemoveUserImage.toast.loading"),
      success: t("handleRemoveUserImage.toast.success"),
      error: t("handleRemoveUserImage.toast.error"),
    });
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Avatar */}
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
                src={user.avatarUrl ?? `https://avatar.vercel.sh/${user.email}`}
              />
              <AvatarFallback className="h-20 w-20 rounded-full">
                {user.name && user.name.length > 0
                  ? user.name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
          </label>
          <UploadInput
            accept="image/*"
            className="peer sr-only"
            generateUploadUrl={generateUploadUrl}
            id="avatar_field"
            multiple={false}
            onUploadStart={handleUploadStart}
            required
            tabIndex={user ? -1 : 0}
            type="file"
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            {t("avatar.uploadHint")}
          </p>
          {user.avatarUrl && (
            <SubmitButton
              isSubmitting={removeUserImagePending}
              onClick={() => {
                hadleRemoveUserImage();
              }}
              size="sm"
              type="button"
              variant="secondary"
            >
              {t("avatar.resetButton")}
            </SubmitButton>
          )}
        </div>
      </div>

      {/* Username */}
      <form
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          usernameForm.handleSubmit();
        }}
      >
        <div className="flex w-full flex-col gap-4 rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-primary">
              {t("username.title")}
            </h2>
            <p className="text-sm font-normal text-primary/60">
              {t("username.description")}
            </p>
          </div>
          <usernameForm.Field
            name="username"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim() === "") {
                  return undefined;
                }
                const result = username.safeParse(value);
                if (!result.success) {
                  return result.error.issues
                    .map((issue) => issue.message)
                    .join(", ");
                }
                return undefined;
              },
              onSubmit: ({ value }) => {
                const result = username.safeParse(value);
                if (!result.success) {
                  return result.error.issues
                    .map((issue) => issue.message)
                    .join(", ");
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <Input
                  autoComplete="off"
                  className={`w-80 bg-transparent ${
                    field.state.meta.errors.length > 0
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Username"
                  required
                  value={field.state.value}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive dark:text-destructive-foreground">
                    {field.state.meta.errors.join(" ")}
                  </p>
                )}
              </>
            )}
          </usernameForm.Field>
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            {t("username.warning")}
          </p>
          <SubmitButton
            isSubmitting={updateUsernamePending}
            size="sm"
            type="submit"
          >
            {t("username.saveButton")}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
