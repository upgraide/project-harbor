"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BriefcaseIcon, HouseIcon, Users2Icon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import NavUserSidebar from "./nav-user";
import { DynamicImage } from "@/components/dynamic-image";
import DarkIcon from "@/public/assets/icon-dark.png";
import LightIcon from "@/public/assets/icon-light.png";
import { Label } from "@/components/ui/label";

const navigationItems = [
  {
    title: "Opportunities M&A",
    url: "/backoffice/mergers-and-acquisitions",
    icon: BriefcaseIcon,
    key: "opportunitiesMA",
  },
  {
    title: "Opportunities Real Estate",
    url: "/backoffice/real-estate",
    icon: HouseIcon,
    key: "opportunitiesRealEstate",
  },
  {
    title: "Investors",
    url: "/backoffice/investors",
    icon: UsersIcon,
    key: "investors",
  },
  {
    title: "Team",
    url: "/backoffice/team",
    icon: Users2Icon,
    key: "team",
  },
];

export const BackofficeSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const t = useScopedI18n("backoffice.sidebar");
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <DynamicImage
                      className="size-4"
                      darkSrc={DarkIcon}
                      lightSrc={LightIcon}
                      alt="Harbor Partners Icon"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      Harbor Partners
                    </span>
                    <span className="truncate text-xs">Backoffice</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={{
                        children: t(`navigationItems.${item.key}`),
                        hidden: false,
                      }}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{t(`navigationItems.${item.key}`)}</span>
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
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {navigationItems.find((item) => item.url === pathname)?.title}
            </div>
          </div>
          <SidebarInput placeholder={t("searchPlaceholder")} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
};
