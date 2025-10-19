"use client";

import {
  BriefcaseBusinessIcon,
  HomeIcon,
  LayoutPanelLeft,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import {
  backofficeMergeAndAcquisitionPath,
  backofficePath,
  backofficeRealEstatePath,
  backofficeUsersPath,
  indexPath,
} from "@/paths";
import { DynamicImage } from "./dynamic-image";
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
} from "./ui/sidebar";

const LOGO_EXPANDED_SIZE = 175;
const LOGO_COLLAPSED_SIZE = 64;

const createMenuItems = (t: ReturnType<typeof useScopedI18n>) => [
  {
    title: t("title"),
    items: [
      {
        title: t("items.backoffice.title"),
        icon: LayoutPanelLeft,
        url: backofficePath(),
      },
      {
        title: t("items.m&a.title"),
        icon: BriefcaseBusinessIcon,
        url: backofficeMergeAndAcquisitionPath(),
      },
      {
        title: t("items.real-estate.title"),
        icon: HomeIcon,
        url: backofficeRealEstatePath(),
      },
      {
        title: t("items.users.title"),
        icon: UsersIcon,
        url: backofficeUsersPath(),
      },
    ],
  },
];

export const AppSidebar = () => {
  const t = useScopedI18n("backoffice.sidebar");
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
            <Link href={backofficePath()} prefetch>
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
                        item.url === backofficePath()
                          ? pathname === backofficePath()
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
