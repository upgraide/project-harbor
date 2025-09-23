"use client";

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { LoaderIcon, PlusIcon, PencilIcon } from "lucide-react";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Page = ({ params }: { params: Promise<{ id: Id<"realEstates"> }> }) => {
  const { id } = use(params);

  const opportunity = useQuery(api.realEstates.getById, {
    id,
  });

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarInset className="bg-muted">
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={backofficeMergersAndAcquisitionsPath()}>
                Mergers and Acquisitions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{opportunity.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="mx-auto md:max-w-screen-md w-full mt-6 mb-6 space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold mt-6">
          {opportunity.name}
        </h1>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Opportunity Images
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              Add Image
            </Button>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Description</CardTitle>
            <Button variant="outline">
              <PencilIcon className="size-4" />
              Edit Description
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Pre-NDA Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="text-right px-6 py-4">
                    {" "}
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default Page;
