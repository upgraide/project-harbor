"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { loginPath } from "@/paths";

const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({ message: t("schemaMessages.email") }),
  });

type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function ForgotPasswordForm() {
  const t = useScopedI18n("auth.forgotPasswordForm");
  const locale = useCurrentLocale();
  const forgotPassword = useForgotPassword();

  const schema = createForgotPasswordSchema(t);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword.mutate({
      email: values.email,
      language: locale as "en" | "pt",
    });
  };

  const isPending = forgotPassword.isPending;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("emailPlaceholder")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={isPending} type="submit">
                  {isPending ? t("submitting") : t("submit")}
                </Button>
                <div className="text-center text-sm">
                  <Link
                    className="underline underline-offset-4"
                    href={loginPath()}
                  >
                    {t("backToLogin")}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
