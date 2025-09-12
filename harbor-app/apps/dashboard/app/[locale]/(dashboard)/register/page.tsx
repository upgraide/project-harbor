"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@harbor-app/ui/components/button";
import { Input } from "@harbor-app/ui/components/input";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const { signIn } = useAuthActions();
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn("password", formData)
          .then(() => {
            toast.success("Account created successfully!");
          })
          .catch((error) => {
            console.error(error);
            let toastTitle: string;
            if (
              error instanceof ConvexError &&
              error.data === "INVALID_PASSWORD"
            ) {
              toastTitle =
                "Invalid password - check the requirements and try again.";
            } else {
              toastTitle = "Could not sign up. Please try again.";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
      }}
    >
      <label htmlFor="email">Email</label>
      <Input autoComplete="email" className="mb-4" id="email" name="email" />
      <label htmlFor="password">Password</label>
      <Input
        autoComplete="new-password"
        id="password"
        name="password"
        type="password"
      />
      <input name="flow" type="hidden" value="signUp" />
      <Button className="mt-4" disabled={submitting} type="submit">
        Sign up
      </Button>
    </form>
  );
}
