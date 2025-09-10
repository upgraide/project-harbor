"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@harbor-app/ui/components/input";
import { Label } from "@harbor-app/ui/components/label";
import { SubmitButton } from "@harbor-app/ui/components/submit-button";
import { ConvexError } from "convex/values";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function PasswordSignIn() {
  const INVALID_PASSWORD = "INVALID_PASSWORD";
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithPassword() {
    console.log("signing in with password", email, password);
    startTransition(async () => {
      signIn("password", { email, password })
        .then(() => {
          console.log("signing in");
          router.push("/");
        })
        .catch((error) => {
          console.error(error);

          let toastTitle: string;
          if (error instanceof ConvexError && error.data === INVALID_PASSWORD) {
            toastTitle =
              "Invalid password - check the requirements and try again.";
          } else {
            toastTitle = "Could not sign in, please contact support.";
          }
          toast.error(toastTitle);
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
