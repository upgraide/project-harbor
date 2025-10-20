"use client";

import { LogOut, Settings, Slash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { dashboardPath, dashboardSettingsPath, indexPath } from "@/paths";

export function Navigation({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
  };
}) {
  const t = useScopedI18n("dashboard.navigation");
  const pathname = usePathname();
  const router = useRouter();

  const isDashboardPath = pathname === dashboardPath();
  const isSettingsPath = pathname === dashboardSettingsPath();

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-border border-b bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link className="flex h-10 items-center gap-1" href={dashboardPath()}>
            <DynamicImage
              alt="Logo"
              className="h-8 w-auto"
              darkSrc="/assets/icon-light.png"
              height={50}
              lightSrc="/assets/icon-dark.png"
              width={50}
            />
          </Link>
          <Slash className="-rotate-12 h-6 w-6 stroke-[1.5px] text-primary/10" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                alt={user.email}
                src={
                  user.image
                    ? user.image
                    : `https://avatar.vercel.sh/${user.email}`
                }
              />
              <AvatarFallback className="h-8 w-8 rounded-full">
                {user.name && user.name.length > 0
                  ? user.name.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p className="font-medium text-sm">{user?.name || user.email}</p>
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
                      user.image
                        ? user.image
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
              className="-right-4 fixed min-w-56 space-y-2 bg-card p-2"
              sideOffset={8}
            >
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="font-medium text-sm group-hover:text-primary group-focus:text-primary">
                  {user.name || user.email?.split("@")[0]}
                </p>
                <p className="text-primary/60 text-sm">{user.email}</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => router.push(dashboardSettingsPath())}
              >
                <span className="text-sm group-hover:text-primary group-focus:text-primary">
                  {t("settings")}
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent"
                )}
              >
                <span className="w-full text-sm group-hover:text-primary group-focus:text-primary">
                  {t("theme")}
                </span>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent"
                )}
              >
                <span className="w-full text-sm group-hover:text-primary group-focus:text-primary">
                  {t("language")}
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => {
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push(indexPath());
                      },
                    },
                  });
                }}
              >
                <span className="text-sm group-hover:text-primary group-focus:text-primary">
                  {t("logout")}
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3">
        <div
          className={cn(
            "flex h-12 items-center border-b-2",
            isDashboardPath ? "border-primary" : "border-transparent"
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })}`
            )}
            href={dashboardPath()}
          >
            {t("dashboard")}
          </Link>
        </div>
        <div
          className={cn(
            "flex h-12 items-center border-b-2",
            isSettingsPath ? "border-primary" : "border-transparent"
          )}
        >
          <Link
            className={cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })}`
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
