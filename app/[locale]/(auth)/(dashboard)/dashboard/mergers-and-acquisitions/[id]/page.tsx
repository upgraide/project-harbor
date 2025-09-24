"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  LoaderIcon,
  PencilIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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
  params: Promise<{ id: Id<"mergersAndAcquisitions"> }>;
}) => {
  const { id } = use(params);

  const opportunity = useQuery(api.mergersAndAcquisitions.getById, {
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
    <>
      <div className="mx-auto md:max-w-screen-md w-full mt-6 mb-6 space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold mt-6">
          {opportunity.name}
        </h1>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Opportunity Images
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2">
            {opportunity.imagesUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  src={imageUrl ?? ""}
                  alt={`Opportunity Image ${index + 1}`}
                  height={4501}
                  width={4501}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold">
              Financial Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={opportunity.graphRows ?? []}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 4)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                  stackId="a"
                />
                <Area
                  dataKey="ebitda"
                  type="natural"
                  fill="var(--color-ebitda)"
                  fillOpacity={0.4}
                  stroke="var(--color-ebitda)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Financial Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunity.type ? (
                  <TableRow key={"type"}>
                    <TableCell className="px-6 py-4">Type</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.type}
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.typeDetails ? (
                  <TableRow key={"typeDetails"}>
                    <TableCell className="px-6 py-4">Type Details</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.typeDetails}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industry ? (
                  <TableRow key={"industry"}>
                    <TableCell className="px-6 py-4">Industry</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.industry}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.industrySubsector ? (
                  <TableRow key={"industrySubsector"}>
                    <TableCell className="px-6 py-4">
                      Industry Subsector
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.industrySubsector}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sales ||
                opportunity.ebitda ||
                opportunity.ebitdaNormalized ||
                opportunity.netDebt ? (
                  <TableRow key={"dimension"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      Dimension
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sales ? (
                  <TableRow key={"sales"}>
                    <TableCell className="px-6 py-4">Sales</TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.sales}M€`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitda ? (
                  <TableRow key={"ebitda"}>
                    <TableCell className="px-6 py-4">EBITDA (Range)</TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitda}M€`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaNormalized ? (
                  <TableRow key={"ebitdaNormalized"}>
                    <TableCell className="px-6 py-4">
                      EBITDA (Normalized)
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.ebitdaNormalized}M€`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.netDebt ? (
                  <TableRow key={"netDebt"}>
                    <TableCell className="px-6 py-4">Net Debt</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.netDebt ? `${opportunity.netDebt}M€` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR || opportunity.ebitdaCAGR ? (
                  <TableRow key={"CAGR"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      CAGR
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.salesCAGR ? (
                  <TableRow key={"salesCAGR"}>
                    <TableCell className="px-6 py-4">Sales CAGR</TableCell>
                    <TableCell className="px-6 py-4">
                      {`${opportunity.salesCAGR}%`}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.ebitdaCAGR ? (
                  <TableRow key={"ebitdaCAGR"}>
                    <TableCell className="px-6 py-4">EBITDA CAGR</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.ebitdaCAGR
                        ? `${opportunity.ebitdaCAGR}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.assetIncluded ||
                opportunity.estimatedAssetValue ? (
                  <TableRow key={"Asset"}>
                    <TableCell className="px-6 py-4 font-medium bg-muted">
                      Asset
                    </TableCell>
                    <TableCell className="px-6 py-4 bg-muted"></TableCell>
                    <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.assetIncluded ? (
                  <TableRow key={"assetIncluded"}>
                    <TableCell className="px-6 py-4">Asset Included</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.assetIncluded ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
                {opportunity.estimatedAssetValue ? (
                  <TableRow key={"estimatedAssetValue"}>
                    <TableCell className="px-6 py-4">
                      Estimated Asset Value
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.estimatedAssetValue
                        ? `${opportunity.estimatedAssetValue}M€`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
