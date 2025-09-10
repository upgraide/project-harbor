"use client";

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
import { useScopedI18n } from "@/locales/client";
import DarkIcon from "@/public/icon-dark.png";
import LightIcon from "@/public/icon-light.png";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function Navigation() {
  const t = useScopedI18n("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardPath = pathname === "/";
  const isSettingsPath = pathname === "/settings";

  const user = {
    avatarUrl: "https://github.com/shadcn.png",
    name: "Rodrigo Santos",
    email: "rodrigo.santos@upgraide.ai",
  };

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
                  {user.avatarUrl ? (
                    <img
                      alt={user.name ?? user.email}
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.avatarUrl}
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user?.name || ""}
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
                  {user.avatarUrl ? (
                    <img
                      alt={user.name ?? user.email}
                      className="h-6 w-6 rounded-full object-cover"
                      src={user.avatarUrl}
                    />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user.name || ""}
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
                {user.avatarUrl ? (
                  <img
                    alt={user.name ?? user.email}
                    className="min-h-8 min-w-8 rounded-full object-cover"
                    src={user.avatarUrl}
                  />
                ) : (
                  <span className="min-h-8 min-w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="fixed -right-4 min-w-56 bg-card p-2 space-y-2"
              sideOffset={8}
            >
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary">
                  {user?.name || ""}
                </p>
                <p className="text-sm text-primary/60">{user?.email}</p>
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
                onClick={() => {}}
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
