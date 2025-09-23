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
import {
  BriefcaseIcon,
  HouseIcon,
  PlusIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import NavUserSidebar from "./nav-user";
import { DynamicImage } from "@/components/dynamic-image";
import DarkIcon from "@/public/assets/icon-dark.png";
import LightIcon from "@/public/assets/icon-light.png";
import { buttonVariants } from "@/components/ui/button";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RefObject, useState } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@/components/infinite-scroll-trigger";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  backofficeRealEstateCreatePath,
  backofficePath,
  backofficeRealEstatePath,
} from "@/lib/paths";

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

export const BackofficeSidebarRealEstate = ({
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

  const [nameFilter, setNameFilter] = useState("");

  const opportunities = usePaginatedQuery(
    api.realEstates.getMany,
    {
      name: nameFilter === "" ? undefined : nameFilter,
    },
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: opportunities.status,
    loadMore: opportunities.loadMore,
    loadSize: 10,
  });

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
                <Link href={backofficePath()}>
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
                </Link>
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
              {pathname === backofficeRealEstateCreatePath()
                ? "Create Opportunity"
                : "Opportunities Real Estate"}
            </div>
            <Link
              href={backofficeRealEstateCreatePath()}
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <PlusIcon className="size-4" />
            </Link>
          </div>
          <SidebarInput
            placeholder={t("searchPlaceholder")}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {isLoadingFirstPage ? (
                <SkeletonOpportunitiesPanel />
              ) : (
                <div className="flex w-full flex-1 flex-col text-sm">
                  {opportunities.results.map((opportunity) => {
                    return (
                      <Link
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                          pathname ===
                            `/backoffice/real-estate/${opportunity._id}` &&
                            "bg-accent text-accent-foreground",
                        )}
                        href={`/backoffice/real-estate/${opportunity._id}`}
                        key={opportunity._id}
                      >
                        <div
                          className={cn(
                            "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                            pathname ===
                              `/backoffice/mergers-and-acquisitions/${opportunity._id}` &&
                              "opacity-100",
                          )}
                        />

                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarImage
                            alt={opportunity.createdBy?.email}
                            src={
                              opportunity.createdBy?.avatarURL ??
                              `https://avatar.vercel.sh/${opportunity.createdBy?.email}`
                            }
                          />
                          <AvatarFallback className="h-10 w-10 rounded-full">
                            {opportunity.createdBy?.name &&
                            opportunity.createdBy?.name.length > 0
                              ? opportunity.createdBy?.name
                                  .charAt(0)
                                  .toUpperCase()
                              : opportunity.createdBy?.email
                                  ?.charAt(0)
                                  .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex w-full items-center gap-2">
                            <span className="truncate font-bold">
                              {opportunity.name}
                            </span>
                            <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                              {formatDistanceToNow(opportunity._creationTime)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <div className="flex w-0 grow items-center gap-1">
                              <span className="line-clamp-1 text-muted-foreground text-xs">
                                {opportunity.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  <InfiniteScrollTrigger
                    canLoadMore={canLoadMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={handleLoadMore}
                    ref={topElementRef as RefObject<HTMLDivElement>}
                  />
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
};

export const SkeletonOpportunitiesPanel = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
