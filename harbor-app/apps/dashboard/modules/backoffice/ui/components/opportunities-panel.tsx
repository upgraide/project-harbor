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
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
