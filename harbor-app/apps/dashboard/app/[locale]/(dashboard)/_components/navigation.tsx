"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import type { api } from "@harbor-app/backend/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@harbor-app/ui/components/avatar";
import { Button, buttonVariants } from "@harbor-app/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@harbor-app/ui/components/dropdown-menu";
import { cn } from "@harbor-app/ui/lib/utils";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  Slash,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useScopedI18n } from "@/locales/client";
import DarkIcon from "@/public/icon-dark.png";
import LightIcon from "@/public/icon-light.png";

export function Navigation({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUser>;
}) {
  const t = useScopedI18n("dashboard");
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardPath = pathname === "/";
  const isSettingsPath = pathname === "/settings";

  const user = usePreloadedQuery(preloadedUser);

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link className="flex h-10 items-center gap-1" href="/">
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-2 px-2 data-[state=open]:bg-primary/5"
                variant="ghost"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      alt={user.email}
                      src={
                        user.avatarUrl ??
                        `https://avatar.vercel.sh/${user.email}`
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
                <span className="flex flex-col items-center justify-center">
                  <ChevronUp className="relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                  <ChevronDown className="relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 bg-card p-2"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center text-xs font-normal text-primary/60">
                {t("navigation.personalAccount")}
              </DropdownMenuLabel>
              <DropdownMenuItem className="h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full">
                    <AvatarImage
                      alt={user.email}
                      src={
                        user.avatarUrl ??
                        `https://avatar.vercel.sh/${user.email}`
                      }
                    />
                    <AvatarFallback className="h-6 w-6 rounded-full">
                      {user.name && user.name.length > 0
                        ? user.name.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-sm font-medium text-primary/80">
                    {user.name || user.email?.split("@")[0]}
                  </p>
                </div>
                <Check className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-10 items-center gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 rounded-full" variant="ghost">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    alt={user.email}
                    src={
                      user.avatarUrl ?? `https://avatar.vercel.sh/${user.email}`
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
                onClick={() => router.push("/settings")}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("navigation.settings")}
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("navigation.theme")}
                </span>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("navigation.language")}
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => {
                  signOut();
                }}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  {t("navigation.logout")}
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
            href="/"
          >
            {t("navigation.dashboard")}
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
            href="/settings"
          >
            {t("navigation.settings")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
