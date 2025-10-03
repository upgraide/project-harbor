"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcherHome } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { homePath, requestAccessPath, signInPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useScopedI18n("signInPage");
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center space-y-4 p-4">
      <div className="absolute top-4 left-4">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={homePath()}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("buttons.back")}
        </Link>
      </div>
      <DynamicImage
        alt="Harbor Partners Logo"
        darkSrc="/assets/logo-light.png"
        height={250}
        lightSrc="/assets/logo-dark.png"
        width={250}
      />
      <div className="w-full max-w-md space-y-4">
        {children}
        <p className="mt-4 text-center text-neutral-600 text-sm dark:text-neutral-400">
          {pathname === requestAccessPath() ? (
            <>
              {t("alreadyHaveAccount")}{" "}
              <Link
                className="text-accent-foreground underline"
                href={signInPath()}
              >
                {t("buttons.membershipLogin")}
              </Link>
            </>
          ) : (
            <>
              {t("dontHaveAccount")}{" "}
              <Link
                className="text-accent-foreground underline"
                href={requestAccessPath()}
              >
                {t("buttons.requestAccess")}
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcherHome />
      </div>
    </div>
  );
};
