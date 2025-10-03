"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { dashboardSettingsPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useScopedI18n("dashboard.settings");
  const pathname = usePathname();
  const isSettingsPath = pathname === dashboardSettingsPath();
  return (
    <div className="flex h-full w-full px-6 py-8">
      <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
          <Link
            className={cn(
              `${buttonVariants({ variant: "ghost" })} ${isSettingsPath && "bg-primary/5"}`,
              "justify-start rounded-md"
            )}
            href={dashboardSettingsPath()}
          >
            <span
              className={cn(
                `text-primary/80 text-sm ${isSettingsPath && "font-medium text-primary"}`
              )}
            >
              {t("general")}
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};
