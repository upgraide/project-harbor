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
import { useMutation, useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { use, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ActionDropdown } from "@/modules/backoffice/ui/components/action-dropdown";
import { ImageGrid } from "@/modules/backoffice/ui/components/image-grid";
import { MetricTable } from "@/modules/backoffice/ui/components/metric-table";
import { SectionHeader } from "@/modules/backoffice/ui/components/section-header";
import { UploadDialog } from "@/modules/backoffice/ui/components/upload-dialog";
import {
  CHART_CONFIG,
  COMMON_STYLES,
} from "@/modules/backoffice/ui/constants/opportunity-constants";
import {
  createPostNDAData,
  createPreNDAData,
} from "@/modules/backoffice/ui/utils/opportunity-data-mapper";

const Page = ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
  const { opportunityId } = use(params);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const opportunity = useQuery(
    api.private.mergersAndAcquisitionsOpportunities.getById,
    {
      opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions">,
    },
  );

  const deleteImage = useMutation(api.private.files.deleteFile);

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
          <SectionHeader
            addButtonText="Add Image"
            onAddClick={() => setUploadDialogOpen(true)}
            showAddButton={true}
            title="Images"
          />
          <div className="p-6">
            <ImageGrid
              images={opportunity.imagesURLs || []}
              imagesStorageIds={opportunity.images || []}
              onAddImage={() => setUploadDialogOpen(true)}
              onDeleteImage={(storageId) => {
                deleteImage({
                  opportunityId: opportunity._id,
                  storageId: storageId as Id<"_storage">,
                });
              }}
              opportunityName={opportunity.name}
            />
          </div>
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader
            editButtonText="Edit Description"
            onEditClick={() => {}}
            showEditButton={true}
            title="Description"
          />
          <p className={`${COMMON_STYLES.mutedText} p-6`}>
            {opportunity.description || "No description available"}
          </p>
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader title="Financial Performance" />
          <div className="p-6">
            <ChartContainer className="h-[400px] w-full" config={CHART_CONFIG}>
              <LineChart
                accessibilityLayer
                data={opportunity.graphRows || []}
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
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="ebitda"
                  dot={true}
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>

            <div className="mt-8 rounded-lg border border-border bg-background">
              <SectionHeader
                addButtonText="Add Year"
                onAddClick={() => {}}
                showAddButton={true}
                title="Graph Data"
              />
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
                    <TableRow className={COMMON_STYLES.tableRow} key={row.year}>
                      <TableCell
                        className={`${COMMON_STYLES.cell} ${COMMON_STYLES.mutedText}`}
                      >
                        {row.year}
                      </TableCell>
                      <TableCell
                        className={`${COMMON_STYLES.cell} ${COMMON_STYLES.mutedText}`}
                      >
                        {row.revenue}
                      </TableCell>
                      <TableCell
                        className={`${COMMON_STYLES.cell} ${COMMON_STYLES.mutedText}`}
                      >
                        {row.ebitda}
                      </TableCell>
                      <TableCell
                        className={`${COMMON_STYLES.cell} flex items-center justify-end`}
                      >
                        <ActionDropdown onDelete={() => {}} onEdit={() => {}} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader
            addButtonText="Add Note"
            onAddClick={() => {}}
            showAddButton={true}
            title="Pre-NDA"
          />
          <MetricTable data={createPreNDAData(opportunity)} />
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader
            addButtonText="Add Note"
            onAddClick={() => {}}
            showAddButton={true}
            title="Post-NDA"
          />
          <MetricTable data={createPostNDAData(opportunity)} />
        </div>
      </div>

      <UploadDialog
        onFileUploaded={() => {
          // Optionally refresh data or show success message
        }}
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
        opportunityId={opportunity._id}
      />
    </div>
  );
};

export default Page;
