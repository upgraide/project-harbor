"use client";

import SignUp from "./_components/sing-up-form";
import Link from "next/link";
import { signInPath } from "@/lib/paths";
import { useCurrentLocale } from "@/locales/client";

export default function SignUpPage() {
  const locale = useCurrentLocale();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp />
        <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href={signInPath(locale)}
            className="text-orange-400 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
