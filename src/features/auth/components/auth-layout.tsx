import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { ThemeSwitcherHome } from "@/components/theme/theme-switcher";
import { indexPath } from "@/paths";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link className="flex items-center gap-2 self-center" href={indexPath()}>
        <DynamicImage
          alt="Harbor"
          darkSrc="/assets/logo-light.png"
          height={200}
          lightSrc="/assets/logo-dark.png"
          width={200}
        />
      </Link>
      {children}
    </div>
    <ThemeSwitcherHome />
    <LanguageSwitcher />
  </div>
);
