"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@harbor-app/ui/components/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@harbor-app/ui/components/table";
import { useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { use } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ImageGrid } from "@/modules/backoffice/ui/components/image-grid";
import {
  CHART_CONFIG,
  COMMON_STYLES,
} from "@/modules/backoffice/ui/constants/opportunity-constants";
import {
  createPreNDAData,
} from "@/modules/backoffice/ui/utils/opportunity-data-mapper";

// Simple MetricTableRow component for read-only display
const ReadOnlyMetricTableRow = ({
  label,
  value,
  suffix = "",
  isHeader = false,
}: {
  label: string;
  value: string | number | null | undefined;
  suffix?: string;
  isHeader?: boolean;
}) => {
  const displayValue = value || "-";
  const hasValue = value !== null && value !== undefined && value !== "";

  if (isHeader) {
    return (
      <TableRow>
        <TableCell className="px-6 py-4 font-medium bg-muted/50">
          {label}
        </TableCell>
        <TableCell className="px-6 py-4 font-medium bg-muted/50"></TableCell>
      </TableRow>
    );
  }

  // Don't render rows with no value for dashboard
  if (!hasValue) {
    return null;
  }

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="px-6 py-4">{label}</TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground">
        {displayValue}
        {hasValue && suffix && <span>{suffix}</span>}
      </TableCell>
    </TableRow>
  );
};

// Read-only MetricTable component
const ReadOnlyMetricTable = ({ data }: { data: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6 py-4 font-medium">Metric</TableHead>
          <TableHead className="px-6 py-4 font-medium">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <ReadOnlyMetricTableRow
            isHeader={"isHeader" in item ? item.isHeader : false}
            key={`${item.label}-${index}`}
            label={item.label}
            suffix={"suffix" in item ? item.suffix : undefined}
            value={"value" in item ? item.value : undefined}
          />
        ))}
      </TableBody>
    </Table>
  );
};

const Page = ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
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
          <h1 className="text-2xl md:text-4xl font-bold">{opportunity.name}</h1>
        </div>

        <div className={COMMON_STYLES.section}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <ImageGrid
              images={opportunity.imagesURLs || []}
              imagesStorageIds={opportunity.images || []}
              onAddImage={() => {}}
              onDeleteImage={() => {}}
              opportunityName={opportunity.name}
              showAddButton={false}
            />
          </div>
        </div>

        <div className={COMMON_STYLES.section}>
          <h2 className="text-xl font-semibold p-6 pb-0">Description</h2>
          <p className={`${COMMON_STYLES.mutedText} p-6`}>
            {opportunity.description || "No description available"}
          </p>
        </div>

        {(opportunity.graphRows && opportunity.graphRows.length > 0) && (
          <div className={COMMON_STYLES.section}>
            <h2 className="text-xl font-semibold p-6 pb-0">Financial Performance</h2>
            <div className="p-6">

              <ChartContainer className="h-[400px] w-full" config={CHART_CONFIG}>
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
                   <Tooltip 
                     cursor={{ 
                       stroke: "hsl(var(--chart-1))", 
                       strokeWidth: 2, 
                       strokeDasharray: "5 5",
                       opacity: 0.7
                     }}
                     labelFormatter={(value) => value ? `Year ${value}` : "Year"}
                     formatter={(value, name) => [
                       typeof value === 'number' ? `$${value}M` : value,
                       CHART_CONFIG[name as keyof typeof CHART_CONFIG]?.label || name
                     ]}
                     contentStyle={{
                       backgroundColor: "hsl(var(--background))",
                       border: "1px solid hsl(var(--border))",
                       borderRadius: "8px",
                       boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                       padding: "12px 16px",
                       fontSize: "14px",
                       fontFamily: "inherit"
                     }}
                     labelStyle={{
                       color: "hsl(var(--foreground))",
                       fontWeight: "600",
                       fontSize: "14px",
                       marginBottom: "8px"
                     }}
                     itemStyle={{
                       color: "hsl(var(--foreground))",
                       fontSize: "13px"
                     }}
                     separator=": "
                     offset={10}
                   />
                   <Legend 
                     verticalAlign="bottom"
                     height={50}
                     wrapperStyle={{
                       paddingTop: "20px",
                       paddingBottom: "10px"
                     }}
                     iconType="line"
                     formatter={(value) => CHART_CONFIG[value as keyof typeof CHART_CONFIG]?.label || value}
                     style={{
                       color: "hsl(var(--foreground))",
                       fontSize: "14px",
                       fontWeight: "500"
                     }}
                   />
                   <Line
                     dataKey="revenue"
                     name="revenue"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     stroke="var(--chart-1)"
                     strokeWidth={3}
                     type="monotone"
                   />
                   <Line
                     dataKey="ebitda"
                     name="ebitda"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     stroke="var(--chart-2)"
                     strokeWidth={3}
                     type="monotone"
                   />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        )}

        <div className={COMMON_STYLES.section}>
          <h2 className="text-xl font-semibold p-6 pb-0">Pre-NDA</h2>
          <div className="p-6">
            <ReadOnlyMetricTable data={createPreNDAData(opportunity)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
