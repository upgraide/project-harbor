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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dashboardPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";

export const SignInView = () => {
  const t = useScopedI18n("signInPage");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          toast.success(t("toastSuccess"));
          router.push(dashboardPath());
        },
        onError: (ctx) => {
          setLoading(false);
          console.error(ctx.error.message);
          toast.error(t("toastError"));
        },
      },
    );
  };

  const handleResetPassword = async () => {
    setForgotLoading(true);
    try {
      await authClient.forgetPassword({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
      toast.success(t("toastResetPasswordSuccess"));
    } catch {
      toast.error(t("toastResetPasswordError"));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={handleResetPassword}
                className="cursor-pointer"
                disabled={forgotLoading || !email}
              >
                {forgotLoading ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : null}
                {t("forgotPassword")}
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 size={14} className="animate-spin mr-1" />
            ) : null}
            {t("buttons.signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
