"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@harbor-app/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@harbor-app/ui/components/table";
import { useQuery } from "convex/react";
import {
  LoaderIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
  WandSparklesIcon,
} from "lucide-react";
import { use } from "react";
import { useScopedI18n } from "@/locales/client";

const Page = ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
  const t = useScopedI18n(
    "backoffice.mergersAndAcquisitions.mergersAndAcquisitionsOportunity",
  );
  const { opportunityId } = use(params);

  const opportunity = useQuery(
    api.private.mergersAndAcquisitionsOpportunities.getById,
    {
      opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions">,
    },
  );

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-8 bg-muted">
      <div className="mx-auto max-w-screen-md w-full">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xlfont-bold">{opportunity.name}</h1>
          <p className=" text-muted-foreground">{opportunity.description}</p>
        </div>

        <div className="mt-8 rounde-lg border border-border bg-background rounded-lg">
          <div className="flex items-center justify-end border-b px-6 py-4">
            <Button
              onClick={() => {
                console.log("Add Note");
              }}
            >
              <PlusIcon />
              Add Note
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4 font-medium">Metric</TableHead>
                <TableHead className="px-6 py-4 font-medium">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Sales</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.sales}
                </TableCell>
                <TableCell className="px-6 py-4 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="size-8 p-0" size="sm" variant="ghost">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <WandSparklesIcon className="size-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {}}
                      >
                        <TrashIcon className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
