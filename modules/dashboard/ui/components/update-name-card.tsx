"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateNameSchema,
  UpdateNameSchemaType,
} from "../schemas/update-name-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScopedI18n } from "@/locales/client";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";

const UpdateNameCard = ({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) => {
  const t = useScopedI18n("dashboard.settings.updateNameCard");
  const user = usePreloadedQuery(preloadedUser);

  if (!user) {
    return null;
  }

  const form = useForm<UpdateNameSchemaType>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = async (values: UpdateNameSchemaType) => {
    toast.promise(
      authClient.updateUser({
        name: values.name,
      }),
      {
        loading: t("toast.loading"),
        success: t("toast.success"),
        error: t("toast.error"),
      },
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
            <h2 className="text-xl font-medium text-primary">{t("title")}</h2>
            <p className="text-sm font-normal text-primary/60">
              {t("description")}
            </p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label")}</FormLabel>
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
        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">{t("warning")}</p>
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
