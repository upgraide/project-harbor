"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
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
          if (ctx.error.message.includes("Invalid email or password")) {
            toast.error(t("toastInvalidCredentials"));
          } else {
            toast.error(t("toastError"));
          }
        },
      }
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
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder={t("emailPlaceholder")}
              required
              type="email"
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                className="cursor-pointer"
                disabled={forgotLoading || !email}
                onClick={handleResetPassword}
                size="sm"
                type="button"
                variant="link"
              >
                {forgotLoading ? (
                  <Loader className="mr-1 animate-spin" size={14} />
                ) : null}
                {t("forgotPassword")}
              </Button>
            </div>
            <Input
              autoComplete="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              type="password"
              value={password}
            />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? (
              <Loader className="mr-1 animate-spin" size={14} />
            ) : null}
            {t("buttons.signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
