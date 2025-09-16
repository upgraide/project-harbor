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
  HouseIcon,
  InboxIcon,
  LibraryBigIcon,
  UserIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import NavUserSidebar from "./nav-user-sidebar";

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
    title: "Opportunities Mergers and Acquisitions",
    url: "/backoffice/opportunities-mergers-and-acquisitions",
    icon: BriefcaseIcon,
  },
  {
    title: "Opportunities Real Estate",
    url: "/backoffice/opportunities-real-estate",
    icon: HouseIcon,
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t("toggle")}>
            <SidebarTrigger size="lg" className="size-8" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
                      `configuration.configurationItems.${item.title.replace(/ /g, "_").toLowerCase()}`,
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>
                        {t(
                          `configuration.configurationItems.${item.title.replace(/ /g, "_").toLowerCase()}`,
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
        <NavUserSidebar />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
