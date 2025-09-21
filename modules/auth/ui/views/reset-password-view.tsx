"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInPath } from "@/lib/paths";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const t = useScopedI18n("resetPasswordPage");

const formSchema = z.object({
  password: z.string().min(8, { message: t("schemaMessages.password.min") }),
  confirmPassword: z
    .string()
    .min(8, { message: t("schemaMessages.confirmPassword.min") }),
});

export const ResetPasswordView = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) return;

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
        onError: (ctx) => {
          setLoading(false);
          console.log(ctx.error.message);
          toast.error(t("schemaMessages.error.default"));
        },
      },
    );
  }

  if (!token) {
    return (
      <div className=" w-full flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("schemaMessages.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("schemaMessages.password.placeholder")}
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
                          "schemaMessages.confirmPassword.placeholder",
                        )}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
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
