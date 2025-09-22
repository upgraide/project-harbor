"use client";

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  LoaderIcon,
  PlusIcon,
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
    <SidebarInset className="bg-muted">
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
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

            <Card className="mt-4">
              <CardHeader className="border-b flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Graph Rows
                </CardTitle>
                <Button variant="outline">
                  <PlusIcon className="size-4" />
                  Add Graph Row
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>EBITDA</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunity.graphRows?.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{row.revenue}</TableCell>
                        <TableCell>{row.ebitda}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EllipsisVerticalIcon className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <PencilIcon className="size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <TrashIcon className="size-4 text-destructive" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
              <TableBody>
                <TableRow key={"type"}>
                  <TableCell className="px-6 py-4">Type</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.type ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                <TableRow key={"typeDetails"}>
                  <TableCell className="px-6 py-4">Type Details</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.typeDetails ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"industry"}>
                  <TableCell className="px-6 py-4">Industry</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industry ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"industrySubsector"}>
                  <TableCell className="px-6 py-4">
                    Industry Subsector
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.industrySubsector ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"dimension"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    Dimension
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"sales"}>
                  <TableCell className="px-6 py-4">Sales</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sales ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitda"}>
                  <TableCell className="px-6 py-4">EBITDA (Range)</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitda ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaNormalized"}>
                  <TableCell className="px-6 py-4">
                    EBITDA (Normalized)
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaNormalized ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netDebt"}>
                  <TableCell className="px-6 py-4">Net Debt</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebt ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"CAGR"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    CAGR
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"salesCAGR"}>
                  <TableCell className="px-6 py-4">Sales CAGR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salesCAGR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaCAGR"}>
                  <TableCell className="px-6 py-4">EBITDA CAGR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaCAGR ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"Asset"}>
                  <TableCell className="px-6 py-4 font-medium bg-muted">
                    Asset
                  </TableCell>
                  <TableCell className="px-6 py-4 bg-muted"></TableCell>
                  <TableCell className="text-right px-6 py-4 bg-muted"></TableCell>
                </TableRow>
                <TableRow key={"assetIncluded"}>
                  <TableCell className="px-6 py-4">Asset Included</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.assetIncluded ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"estimatedAssetValue"}>
                  <TableCell className="px-6 py-4">
                    Estimated Asset Value
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedAssetValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Post-NDA Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="text-right px-6 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"shareholderStructure"}>
                  <TableCell className="px-6 py-4">
                    Shareholder Structure
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.shareholderStructure ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"im"}>
                  <TableCell className="px-6 py-4">IM</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.im ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"entrepriseValue"}>
                  <TableCell className="px-6 py-4">Entreprise Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.entrepriseValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"equityValue"}>
                  <TableCell className="px-6 py-4">Equity Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.equityValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaEntry"}>
                  <TableCell className="px-6 py-4">EV/EBITDA Entry</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaEntry ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"evDashEbitdaExit"}>
                  <TableCell className="px-6 py-4">EV/EBITDA Exit</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.evDashEbitdaExit ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"ebitdaMargin"}>
                  <TableCell className="px-6 py-4">EBITDA Margin</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ebitdaMargin ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"fcf"}>
                  <TableCell className="px-6 py-4">FCF</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.fcf ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"netDebtDashEbitda"}>
                  <TableCell className="px-6 py-4">Net Debt/EBITDA</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.netDebtDashEbitda ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"capexItensity"}>
                  <TableCell className="px-6 py-4">Capex Intensity</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexItensity ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
                <TableRow key={"workingCapitalNeeds"}>
                  <TableCell className="px-6 py-4">
                    Working Capital Needs
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.workingCapitalNeeds ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {opportunity.coInvestment && (
          <Card>
            <CardHeader className="border-b flex items-center justify-between">
              <CardTitle className="text-xl font-semid">
                Co-Investment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">Metric</TableHead>
                    <TableHead className="px-6 py-4">Value</TableHead>
                    <TableHead className="text-right px-6 py-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={"coInvestment"}>
                    <TableCell className="px-6 py-4">Co-Investment</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coInvestment ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                  <TableRow key={"equityContribution"}>
                    <TableCell className="px-6 py-4">
                      Equity Contribution
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.equityContribution ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"grossIRR"}>
                    <TableCell className="px-6 py-4">Gross IRR</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.grossIRR ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"netIRR"}>
                    <TableCell className="px-6 py-4">Net IRR</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.netIRR ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"moic"}>
                    <TableCell className="px-6 py-4">MOIC</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.moic ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"cashOnCashReturn"}>
                    <TableCell className="px-6 py-4">
                      Cash On Cash Return
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.cashOnCashReturn ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"cashConvertion"}>
                    <TableCell className="px-6 py-4">Cash Convertion</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.cashConvertion ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"entryMultiple"}>
                    <TableCell className="px-6 py-4">Entry Multiple</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.entryMultiple ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"exitExpectedMultiple"}>
                    <TableCell className="px-6 py-4">
                      Exit Expected Multiple
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.exitExpectedMultiple ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                  <TableRow key={"holdPeriod"}>
                    <TableCell className="px-6 py-4">Hold Period</TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.holdPeriod ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
};

export default Page;
