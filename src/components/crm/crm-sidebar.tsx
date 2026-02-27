"use client";

import {
  BookUserIcon,
  DollarSignIcon,
  LayoutPanelLeft,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DynamicImage } from "@/components/dynamic-image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import {
  backofficePath,
  crmCommissionsPath,
  crmLeadsPath,
  crmPath,
  indexPath,
} from "@/paths";

const LOGO_EXPANDED_SIZE = 175;
const LOGO_COLLAPSED_SIZE = 64;

// Use simple function type to avoid TypeScript excessive complexity
const createMenuItems = (t: (key: string) => string) => [
  {
    title: t("title"),
    items: [
      {
        title: t("items.crm.title"),
        icon: BookUserIcon,
        url: crmPath(),
      },
      {
        title: t("items.leads.title"),
        icon: BookUserIcon,
        url: crmLeadsPath(),
      },
      {
        title: t("items.commissions.title"),
        icon: DollarSignIcon,
        url: crmCommissionsPath(),
      },
    ],
  },
];

export const CrmSidebar = () => {
  const t = useScopedI18n("crm.sidebar");
  const menuItems = createMenuItems(t);
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="flex h-10 items-center justify-center gap-x-4 px-4"
          >
            <Link href={crmPath()} prefetch>
              <DynamicImage
                alt="Harbor"
                darkSrc={
                  state === "collapsed"
                    ? "/assets/icon-light.png"
                    : "/assets/logo-light.png"
                }
                height={
                  state === "collapsed"
                    ? LOGO_COLLAPSED_SIZE
                    : LOGO_EXPANDED_SIZE
                }
                lightSrc={
                  state === "collapsed"
                    ? "/assets/icon-dark.png"
                    : "/assets/logo-dark.png"
                }
                width={
                  state === "collapsed"
                    ? LOGO_COLLAPSED_SIZE
                    : LOGO_EXPANDED_SIZE
                }
              />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="mt-4 h-10 gap-x-4 bg-primary px-4 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            tooltip={t("items.backoffice.title")}
            variant="default"
          >
            <Link href={backofficePath()} prefetch>
              <LayoutPanelLeft className="size-4" />
              <span>{t("items.backoffice.title")}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 gap-x-4 px-4"
                      isActive={
                        item.url === crmPath()
                          ? pathname === crmPath()
                          : pathname.startsWith(item.url)
                      }
                      tooltip={item.title}
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 gap-x-4 px-4"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push(indexPath());
                    },
                  },
                });
              }}
              tooltip={t("items.logout.title")}
            >
              <LogOutIcon className="size-4" />
              <span>{t("items.logout.title")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
