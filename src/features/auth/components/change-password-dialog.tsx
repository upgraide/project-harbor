"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PASSWORD } from "@/config/constants";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

const createChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: t("schemaMessages.currentPassword.required") }),
      newPassword: z
        .string()
        .min(PASSWORD.MIN_LENGTH, {
          message: t("schemaMessages.newPassword.minLength"),
        })
        .min(1, { message: t("schemaMessages.newPassword.required") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("schemaMessages.confirmPassword.required") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("schemaMessages.confirmPassword.match"),
      path: ["confirmPassword"],
    });

type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordDialogProps) {
  const t = useScopedI18n("auth.changePasswordDialog");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const changePasswordSchema = createChangePasswordSchema(t);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutationWithForm = useMutation(
    trpc.users.changePassword.mutationOptions({
      onSuccess: () => {
        // Refetch password status to update the UI
        queryClient.invalidateQueries(
          trpc.users.getPasswordChangedStatus.queryOptions()
        );
        toast.success("Password changed successfully");
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to change password";
        toast.error(errorMessage);
      },
    })
  );

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePasswordMutationWithForm.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const isPending =
    form.formState.isSubmitting || changePasswordMutationWithForm.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currentPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                {t("cancel")}
              </Button>
              <Button disabled={isPending} type="submit">
                {t("submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
