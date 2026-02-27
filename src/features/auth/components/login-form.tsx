"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { dashboardPath, forgotPasswordPath, requestAccessPath } from "@/paths";

const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({ message: t("schemaMessages.email") }),
    password: z
      .string()
      .min(1, { message: t("schemaMessages.password.required") }),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const t = useScopedI18n("auth.loginForm");
  const router = useRouter();

  const loginSchema = createLoginSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: dashboardPath(),
      },
      {
        onSuccess: () => {
          router.push(dashboardPath());
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
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
                  <Button className="w-full" disabled={isPending} type="submit">
                    {t("submit")}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  <Link
                    className="underline underline-offset-4"
                    href={forgotPasswordPath()}
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <div className="text-center text-sm">
                  {t("dontHaveAccount")}{" "}
                  <Link
                    className="underline underline-offset-4"
                    href={requestAccessPath()}
                  >
                    {t("requestAccess")}
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
