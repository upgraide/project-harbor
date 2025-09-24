"use client";

import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { LogOut, Settings, Slash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useScopedI18n } from "@/locales/client";
import DarkIcon from "@/public/assets/icon-dark.png";
import LightIcon from "@/public/assets/icon-light.png";
import { dashboardSettingsPath, dashboardPath } from "@/lib/paths";
import { useLogout } from "@/hooks/use-signout";
import { Id } from "@/convex/_generated/dataModel";

export function Navigation({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const t = useScopedI18n("dashboard.navigation");
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardPath = pathname === dashboardPath();
  const isSettingsPath = pathname === dashboardSettingsPath();

  const user = usePreloadedQuery(preloadedUser);

  const userImageUrl = useQuery(
    api.files.getUrlById,
    user?.image ? { id: user.image as Id<"_storage"> } : "skip",
  );

  const { handleLogout } = useLogout();

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link className="flex h-10 items-center gap-1" href={dashboardPath()}>
            <DynamicImage
              alt="Logo"
              className="h-8 w-auto"
              darkSrc={LightIcon}
              height={50}
              lightSrc={DarkIcon}
              width={50}
            />
          </Link>
          <Slash className="h-6 w-6 -rotate-12 stroke-[1.5px] text-primary/10" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                alt={user.email}
                src={
                  user.image && userImageUrl
                    ? userImageUrl
                    : `https://avatar.vercel.sh/${user.email}`
                }
              />
              <AvatarFallback className="h-8 w-8 rounded-full">
                {user.name && user.name.length > 0
                  ? user.name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p className="text-sm font-medium text-primary/80">
              {user?.name || user.email}
            </p>
          </div>
        </div>

        <div className="flex h-10 items-center gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 rounded-full" variant="ghost">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    alt={user.email}
                    src={
                      user.image && userImageUrl
                        ? userImageUrl
                        : `https://avatar.vercel.sh/${user.email}`
                    }
                  />
                  <AvatarFallback className="h-8 w-8 rounded-full">
                    {user.name && user.name.length > 0
                      ? user.name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="fixed -right-4 min-w-56 bg-card p-2 space-y-2"
              sideOffset={8}
            >
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary">
                  {user.name || user.email?.split("@")[0]}
                </p>
                <p className="text-sm text-primary/60">{user.email}</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => router.push(dashboardSettingsPath())}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("settings")}
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("theme")}
                </span>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("language")}
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => {
                  handleLogout();
                }}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("logout")}
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3">
        <div
          className={cn(
            "flex h-12 items-center border-b-2",
            isDashboardPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`,
            )}
            href={dashboardPath()}
          >
            {t("dashboard")}
          </Link>
        </div>
        <div
          className={cn(
            "flex h-12 items-center border-b-2",
            isSettingsPath ? "border-primary" : "border-transparent",
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`,
            )}
            href={dashboardSettingsPath()}
          >
            {t("settings")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
