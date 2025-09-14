"use client";

import { ScrollArea } from "@harbor-app/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@harbor-app/ui/components/select";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
  Scroll,
} from "lucide-react";

export const OpportunitiesPanel = () => {
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
        <div className="flex w-full flex-1 flex-col text-sm"></div>
      </ScrollArea>
    </div>
  );
};
