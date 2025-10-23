"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useScopedI18n } from "@/locales/client";
import { useUpdateProfileName } from "../hooks/use-update-profile";
import {
  type UpdateProfileSchemaType,
  updateProfileSchema,
} from "../schemas/update-profile-schema";

type UpdateNameCardProps = {
  initialName?: string;
};

const UpdateNameCard = ({ initialName }: UpdateNameCardProps) => {
  const t = useScopedI18n("dashboard.settings.updateProfileCard");
  const updateProfileName = useUpdateProfileName();
  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName || "",
    },
  });

  const currentName = form.watch("name");
  const isNameChanged = currentName !== (initialName || "");

  const onSubmit = (values: UpdateProfileSchemaType) => {
    toast.promise(
      updateProfileName.mutateAsync({
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
          <Button
            disabled={form.formState.isSubmitting || !isNameChanged}
            size="sm"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="size-4" />
                {t("saveButton")}
              </>
            ) : (
              t("saveButton")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateNameCard;
