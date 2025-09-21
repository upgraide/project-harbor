"use client";

import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import {
  EllipsisVerticalIcon,
  InboxIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useScopedI18n } from "@/locales/client";
import { useLogout } from "@/hooks/use-signout";
import { Id } from "@/convex/_generated/dataModel";

const NavUserSidebar = () => {
  const user = useQuery(api.auth.getCurrentUser);

  const userImageUrl = useQuery(
    api.files.getUrlById,
    user?.image ? { id: user.image as Id<"_storage"> } : "skip",
  );

  const { isMobile } = useSidebar();
  const { handleLogout } = useLogout();
  const t = useScopedI18n("backoffice.sidebar.navUserSidebar");

  if (!user) {
    return <Skeleton className="size-8 shrink-0 rounded-full" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  alt={user.email}
                  src={
                    user.image && userImageUrl
                      ? userImageUrl
                      : `https://avatar.vercel.sh/${user.email}`
                  }
                />
                <AvatarFallback className="rounded-lg">
                  {user.name && user.name.length > 0
                    ? user.name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={user.email}
                    src={
                      user.image && userImageUrl
                        ? userImageUrl
                        : `https://avatar.vercel.sh/${user.email}`
                    }
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name && user.name.length > 0
                      ? user.name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                {t("account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <InboxIcon />
                {t("notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center justify-between">
                {t("language")} <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                {t("theme")} <ThemeSwitcher />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOutIcon />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUserSidebar;
