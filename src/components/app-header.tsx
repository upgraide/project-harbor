"use client";

import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import { indexPath } from "@/paths";
import { SidebarTrigger } from "./ui/sidebar";

type AppHeaderProps = {
  user?: {
    name: string;
    email: string;
    image: string;
  };
};

export const AppHeader = ({ user }: AppHeaderProps) => {
  const router = useRouter();
  const t = useScopedI18n("dashboard.navigation");

  // Extract email prefix without causing TypeScript excessive complexity
  const emailPrefix =
    typeof user?.email === "string" && user.email.includes("@")
      ? user.email.slice(0, user.email.indexOf("@"))
      : undefined;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <SidebarTrigger />

      {user && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 rounded-full" variant="ghost">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage alt={user.email} src={user.image || ""} />
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
                {user.name || emailPrefix}
              </p>
              <p className="text-primary/60 text-sm">{user.email}</p>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
              onClick={() => router.push("/settings")}
            >
              <span className="text-sm group-hover:text-primary group-focus:text-primary">
                {t("settings")}
              </span>
              <Settings className="h-[18px] w-[18px] stroke-[1.5px] group-hover:text-primary group-focus:text-primary" />
            </DropdownMenuItem>

            <DropdownMenuItem className="group flex h-9 justify-between rounded-md px-2 hover:bg-transparent">
              <span className="w-full text-sm group-hover:text-primary group-focus:text-primary">
                {t("theme")}
              </span>
              <ThemeSwitcher />
            </DropdownMenuItem>

            <DropdownMenuItem className="group flex h-9 justify-between rounded-md px-2 hover:bg-transparent">
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
      )}
    </header>
  );
};
