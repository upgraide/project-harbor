"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@harbor-app/ui/components/avatar";
import { ScrollArea } from "@harbor-app/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@harbor-app/ui/components/select";
import { cn } from "@harbor-app/ui/lib/utils";
import { usePaginatedQuery, useQuery } from "convex/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
  Scroll,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const OpportunitiesPanel = () => {
  const pathname = usePathname();
  const opportunities = usePaginatedQuery(
    api.private.opportunities.getManyMergersAndAcquisition,
    {
      status: undefined,
    },
    {
      initialNumItems: 10,
    },
  );

  return (
    <div className="flex h-full flex-col w-full bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select defaultValue="all" onValueChange={() => {}} value="all">
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="no-interest">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>No Interest</span>
              </div>
            </SelectItem>
            <SelectItem value="interested">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Interested</span>
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Completed</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="max-h-[calc(100vh-53px)]">
        <div className="flex w-full flex-1 flex-col text-sm">
          {opportunities.results.map((opportunity) => {
            return (
              <Link
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                  pathname === `/backoffice/opportunities/${opportunity._id}` &&
                    "bg-accent text-accent-foreground",
                )}
                href={`backoffice/opportunities/${opportunity._id}`}
                key={opportunity._id}
              >
                <div
                  className={cn(
                    "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                    pathname ===
                      `/backoffice/opportunities/${opportunity._id}` &&
                      "opacity-100",
                  )}
                />

                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    alt={opportunity.createdBy?.email}
                    src={
                      opportunity.createdBy?.avatarURL ??
                      `https://avatar.vercel.sh/${opportunity.createdBy?.email}`
                    }
                  />
                  <AvatarFallback className="h-8 w-8 rounded-full">
                    {opportunity.createdBy?.name &&
                    opportunity.createdBy?.name.length > 0
                      ? opportunity.createdBy?.name.charAt(0).toUpperCase()
                      : opportunity.createdBy?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
