"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BellIcon,
  BookUserIcon,
  BriefcaseBusinessIcon,
  ChartBarIcon,
  HeartIcon,
  HomeIcon,
  LayoutPanelLeft,
  LogOutIcon,
  UserPlusIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useScopedI18n } from "@/locales/client";
import {
  backofficeAccessRequestsPath,
  backofficeAnalyticsPath,
  backofficeInvestmentInterestsPath,
  backofficeInvestorsPath,
  backofficeMergeAndAcquisitionPath,
  backofficeNotificationsPath,
  backofficePath,
  backofficeRealEstatePath,
  backofficeUsersPath,
  crmPath,
  dashboardPath,
  indexPath,
} from "@/paths";
import { useTRPC } from "@/trpc/client";
import { DynamicImage } from "./dynamic-image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

const LOGO_EXPANDED_SIZE = 175;
const LOGO_COLLAPSED_SIZE = 64;

// Use simple function type to avoid TypeScript excessive complexity
const createMenuItems = (t: (key: string) => string) => [
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
      {
        title: t("items.investors.title"),
        icon: WalletIcon,
        url: backofficeInvestorsPath(),
      },
      {
        title: t("items.analytics.title"),
        icon: ChartBarIcon,
        url: backofficeAnalyticsPath(),
      },
      {
        title: t("items.investment-interests.title"),
        icon: HeartIcon,
        url: backofficeInvestmentInterestsPath(),
      },
      {
        title: t("items.notifications.title"),
        icon: BellIcon,
        url: backofficeNotificationsPath(),
      },
      {
        title: t("items.access-requests.title"),
        icon: UserPlusIcon,
        url: backofficeAccessRequestsPath(),
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
  const trpc = useTRPC();
  const { data: unreadData } = useQuery(
    trpc.notifications.getUnreadCount.queryOptions()
  );
  const unreadCount = unreadData?.count ?? 0;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="flex h-10 items-center justify-center gap-x-4 px-4"
          >
            <Link href={dashboardPath()} prefetch>
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
            tooltip="CRM"
            variant="default"
          >
            <Link href={crmPath()} prefetch>
              <BookUserIcon className="size-4" />
              <span>CRM</span>
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
                    {item.url === backofficeNotificationsPath() &&
                      unreadCount > 0 && (
                        <SidebarMenuBadge className="bg-primary text-primary-foreground">
                          {unreadCount}
                        </SidebarMenuBadge>
                      )}
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
