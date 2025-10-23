"use client";

import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Header = () => {
  const isMobile = useIsMobile();
  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex items-center justify-between p-0 sm:p-6",
        isMobile && "flex-col gap-4"
      )}
    >
      <DynamicImage
        alt="logo"
        className="h-16 w-auto"
        darkSrc="/assets/logo-dark.png"
        height={250}
        lightSrc="/assets/logo-light.png"
        width={250}
      />
      <LanguageSwitcher />
    </header>
  );
};

export { Header };
