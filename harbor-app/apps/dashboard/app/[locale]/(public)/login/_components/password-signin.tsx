"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@harbor-app/ui/components/input";
import { Label } from "@harbor-app/ui/components/label";
import { SubmitButton } from "@harbor-app/ui/components/submit-button";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

export default function PasswordSignIn() {
  const t = useScopedI18n("login.toastTitle");
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithPassword() {
    if (!email.trim()) {
      toast.error(t("emailRequired"));
      return;
    }

    if (!password.trim()) {
      toast.error(t("passwordRequired"));
      return;
    }

    startTransition(async () => {
      await signIn("password", { email, password, flow: "signIn" })
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log(error, "error");
          toast.error(t("couldNotSignIn"));
        });
    });
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
          type="text"
          value={email}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          type="password"
          value={password}
        />
      </div>

      <SubmitButton
        className="bg-primary px-6 py-4 text-secondary font-medium h-[40px] w-full"
        isSubmitting={pending}
        onClick={signInWithPassword}
      >
        <div className="flex items-center space-x-2">
          <Send className="size-4" />
          <span>Continue</span>
        </div>
      </SubmitButton>
    </div>
  );
}
