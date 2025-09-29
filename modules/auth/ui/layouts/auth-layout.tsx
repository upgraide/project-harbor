"use client";

import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { homePath, requestAccessPath, signInPath } from "@/lib/paths";
import { ThemeSwitcherHome } from "@/components/theme-switcher";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { usePathname } from "next/navigation";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useScopedI18n("signInPage");
  const pathname = usePathname();

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
        lightSrc="/assets/logo-dark.png"
        darkSrc="/assets/logo-light.png"
        height={250}
        width={250}
      />
      <div className="w-full max-w-md space-y-4">
        {children}
        <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {pathname === requestAccessPath() ? (
            <>
              {t("alreadyHaveAccount")}{" "}
              <Link
                href={signInPath()}
                className="text-accent-foreground underline"
              >
                {t("buttons.membershipLogin")}
              </Link>
            </>
          ) : (
            <>
              {t("dontHaveAccount")}{" "}
              <Link
                href={requestAccessPath()}
                className="text-accent-foreground underline"
              >
                {t("buttons.requestAccess")}
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="flex justify-center flex-col items-center gap-4">
        <LanguageSwitcher />
        <ThemeSwitcherHome />
      </div>
    </div>
  );
};
