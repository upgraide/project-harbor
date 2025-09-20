"use client";

import SignInForm from "./_components/sign-in-form";
import Link from "next/link";
import logoLight from "@/public/assets/logo-light.png";
import logoDark from "@/public/assets/logo-dark.png";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { homePath, requestAccessPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";
import { ThemeSwitcherHome } from "@/components/theme-switcher";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SignInPage() {
  const t = useScopedI18n("signInPage");

  return (
    <div className="min-h-svh w-full flex flex-col items-center justify-center p-4 space-y-4">
      <div className="absolute top-4 left-4">
        <Link
          href={homePath()}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t("buttons.back")}
        </Link>
      </div>
      <DynamicImage
        alt="Harbor Partners Logo"
        lightSrc={logoDark}
        darkSrc={logoLight}
        height={250}
        width={250}
      />
      <div className="w-full max-w-md space-y-4">
        <SignInForm />
        <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {t("dontHaveAccount")}{" "}
          <Link
            href={requestAccessPath()}
            className="text-accent-foreground underline"
          >
            {t("buttons.requestAccess")}
          </Link>
        </p>
      </div>
      <div className="flex justify-center flex-col items-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcherHome />
      </div>
    </div>
  );
}
