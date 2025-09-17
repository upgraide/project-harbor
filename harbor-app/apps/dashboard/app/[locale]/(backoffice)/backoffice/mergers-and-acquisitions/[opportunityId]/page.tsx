"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@harbor-app/ui/components/chart";
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
  ImageOffIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
  WandSparklesIcon,
} from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useScopedI18n } from "@/locales/client";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  ebitda: {
    label: "EBITDA",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

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

        <div className="mt-8 rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Images</h1>
            <Button onClick={() => {}} size="sm">
              <PlusIcon className="size-4 mr-2" />
              Add Image
            </Button>
          </div>
          <div className="p-6">
            {opportunity.imagesURLs && opportunity.imagesURLs.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunity.imagesURLs.map((image, index) => (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-all duration-200 hover:shadow-md hover:scale-105"
                    key={image}
                  >
                    <Image
                      alt={`${opportunity.name} - Image ${index + 1}`}
                      className="object-cover transition-transform duration-200 group-hover:scale-110"
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      src={image}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        className="size-8 p-0"
                        onClick={() => {
                          console.log("Delete image", image);
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ImageOffIcon className="size-4" />
                </div>
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No images uploaded
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add images to showcase this opportunity
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Pre-NDA</h1>
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
                <TableHead className="px-6 py-4 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">
                  Type (Buy In/Buy Out)
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.type}
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Type Details</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.typeDetails}
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Industry</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.industry}
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Sub Industry</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.subIndustry || "-"}
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
              <TableRow>
                <TableCell className="px-6 py-4 font-medium bg-muted/50">
                  Dimension
                </TableCell>
                <TableCell className="px-6 py-4 font-medium bg-muted/50"></TableCell>
                <TableCell className="px-6 py-4 font-medium bg-muted/50"></TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Sales</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.sales}M€
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">EBITDA (Range)</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.ebitda}M€
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">EBITDA (Normalized)</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.ebitdaNormalized || "-"}
                  {opportunity.ebitdaNormalized && <span>M€</span>}
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
              <TableRow className="hover:bg-muted/50">
                <TableCell className="px-6 py-4">Net Debt</TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {opportunity.netDebt || "-"}
                  {opportunity.netDebt && <span>M€</span>}
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

        <div className="mt-8 rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Financial Performance</h1>
          </div>
          <div className="p-6">
            <ChartContainer className="h-[400px] w-full" config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={opportunity.graphRows}
                margin={{
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="year"
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="revenue"
                  dot={true}
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="ebitda"
                  dot={true}
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>

            <div className="mt-8 rounded-lg border border-border bg-background">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h1 className="text-lg font-medium">Graph Data</h1>
                <Button
                  onClick={() => {
                    console.log("Add Note");
                  }}
                >
                  <PlusIcon />
                  Add Year
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4 font-medium">
                      Year
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      Revenue
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium">
                      EBITDA
                    </TableHead>
                    <TableHead className="px-6 py-4 font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunity.graphRows?.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {row.year}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {row.revenue}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {row.ebitda}
                      </TableCell>
                      <TableCell className="px-6 py-4 flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              size="sm"
                              variant="ghost"
                            >
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
