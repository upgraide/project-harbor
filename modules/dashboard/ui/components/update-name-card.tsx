"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import {
  type UpdateNameSchemaType,
  updateNameSchema,
} from "../schemas/update-name-schema";

const UpdateNameCard = ({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const t = useScopedI18n("dashboard.settings.updateNameCard");
  const user = usePreloadedQuery(preloadedUser);

  const form = useForm<UpdateNameSchemaType>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: user?.name,
    },
  });

  if (!user) {
    return null;
  }

  const onSubmit = (values: UpdateNameSchemaType) => {
    toast.promise(
      authClient.updateUser({
        name: values.name,
      }),
      {
        loading: t("toast.loading"),
        success: t("toast.success"),
        error: t("toast.error"),
      }
    );
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-full flex-col gap-4 rounded-lg p-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-xl">{t("title")}</h2>
            <p className="font-normal text-sm">{t("description")}</p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("placeholder")}
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-border border-t bg-secondary px-6">
          <p className="font-normal text-sm">{t("warning")}</p>
          <SubmitButton
            isSubmitting={form.formState.isSubmitting}
            size="sm"
            type="submit"
          >
            {t("saveButton")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default UpdateNameCard;
