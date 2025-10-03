"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { signInPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";
import {
  type PasswordResetSchemaType,
  passwordResetSchema,
} from "../schemas/password-reset-schema";

export const ResetPasswordView = () => {
  const t = useScopedI18n("resetPasswordPage");

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<PasswordResetSchemaType>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: PasswordResetSchemaType) {
    if (!token) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error(t("schemaMessages.confirmPassword.match"));
      return;
    }

    await authClient.resetPassword(
      {
        token,
        newPassword: values.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          redirect(signInPath());
        },
        onError: (_ctx) => {
          setLoading(false);
          toast.error(t("schemaMessages.error.default"));
        },
      }
    );
  }

  if (!token) {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg md:text-xl">
              {t("invalidLinkCard.title")}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {t("invalidLinkCard.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t("resetPasswordCard.title")}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t("resetPasswordCard.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("schemaMessages.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("schemaMessages.password.placeholder")}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("schemaMessages.password.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("schemaMessages.confirmPassword.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "schemaMessages.confirmPassword.placeholder"
                        )}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("schemaMessages.confirmPassword.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  t("buttons.submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
