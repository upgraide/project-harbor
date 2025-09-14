"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@harbor-app/ui/components/sidebar";
import {
  BriefcaseIcon,
  InboxIcon,
  LibraryBigIcon,
  UserIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import { useScopedI18n } from "@/locales/client";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/backoffice/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/backoffice/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems = [
  {
    title: "Opportunities",
    url: "/backoffice/opportunities",
    icon: BriefcaseIcon,
  },
  {
    title: "Investors",
    url: "/backoffice/investors",
    icon: UsersIcon,
  },
  {
    title: "Team",
    url: "/backoffice/team",
    icon: Users2Icon,
  },
];

const accountItems = [
  {
    title: "Settings",
    url: "/backoffice/account",
    icon: UserIcon,
  },
];

export const BackofficeSidebar = () => {
  const t = useScopedI18n("backoffice.sidebar");
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        {/* Customer Support */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("customerSupport.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={t(
                      `customerSupport.customerSupportItems.${item.title.replace(" ", "_").toLowerCase()}`,
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>
                        {t(
                          `customerSupport.customerSupportItems.${item.title.replace(" ", "_").toLowerCase()}`,
                        )}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("configuration.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={t(
                      `configuration.configurationItems.${item.title.replace(" ", "_").toLowerCase()}`,
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>
                        {t(
                          `configuration.configurationItems.${item.title.replace(" ", "_").toLowerCase()}`,
                        )}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("account.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={t(
                      `account.accountItems.${item.title.replace(" ", "_").toLowerCase()}`,
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>
                        {t(
                          `account.accountItems.${item.title.replace(" ", "_").toLowerCase()}`,
                        )}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/backoffice/account">
                <UserIcon className="size-4" />
                <span>{t("account.accountItems.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
