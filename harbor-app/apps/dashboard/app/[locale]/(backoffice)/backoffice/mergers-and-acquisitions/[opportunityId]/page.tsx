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
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ActionDropdown } from "@/modules/backoffice/ui/components/action-dropdown";
import { AddYearDialog } from "@/modules/backoffice/ui/components/add-year-dialog";
import { DeleteFieldAlertDialog } from "@/modules/backoffice/ui/components/delete-field-alert-dialog";
import { DeleteYearAlertDialog } from "@/modules/backoffice/ui/components/delete-year-alert-dialog";
import { DescriptionEditDialog } from "@/modules/backoffice/ui/components/description-edit-dialog";
import { EditFieldDialog } from "@/modules/backoffice/ui/components/edit-field-dialog";
import { EditYearDialog } from "@/modules/backoffice/ui/components/edit-year-dialog";
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
import { toast } from "sonner";

const Page = ({
  params,
}: {
  params: Promise<{ opportunityId: Id<"opportunitiesMergersAndAcquisitions"> }>;
}) => {
  const { opportunityId } = use(params);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [addYearDialogOpen, setAddYearDialogOpen] = useState(false);
  const [editYearDialogOpen, setEditYearDialogOpen] = useState(false);
  const [deleteYearDialogOpen, setDeleteYearDialogOpen] = useState(false);
  const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
  const [deleteFieldDialogOpen, setDeleteFieldDialogOpen] = useState(false);
  const [selectedYearData, setSelectedYearData] = useState<{
    year: number;
    revenue: number;
    ebitda: number;
  } | null>(null);
  const [selectedFieldData, setSelectedFieldData] = useState<{
    field: string;
    value: any;
    label: string;
  } | null>(null);

  const opportunity = useQuery(
    api.private.mergersAndAcquisitionsOpportunities.getById,
    {
      opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions">,
    },
  );

  const deleteImage = useMutation(api.private.files.deleteFile);

  const handleDeleteImage = (storageId: Id<"_storage">) => {
    deleteImage({
      opportunityId: opportunityId as Id<"opportunitiesMergersAndAcquisitions">,
      storageId: storageId as Id<"_storage">,
    });

    toast.success("Image deleted successfully");
  };

  const handleEditYear = (yearData: { year: number; revenue: number; ebitda: number }) => {
    setSelectedYearData(yearData);
    setEditYearDialogOpen(true);
  };

  const handleDeleteYear = (yearData: { year: number; revenue: number; ebitda: number }) => {
    setSelectedYearData(yearData);
    setDeleteYearDialogOpen(true);
  };

  const handleEditField = (field: string, value: any) => {
    setSelectedFieldData({ field, value, label: field });
    setEditFieldDialogOpen(true);
  };

  const handleDeleteField = (field: string, label: string) => {
    setSelectedFieldData({ field, value: null, label });
    setDeleteFieldDialogOpen(true);
  };

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
               handleDeleteImage(storageId);
              }}
              opportunityName={opportunity.name}
            />
          </div>
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader
            editButtonText="Edit Description"
            onEditClick={() => setDescriptionDialogOpen(true)}
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

            <div className="mt-8 rounded-lg border border-border bg-background">
              <SectionHeader
                addButtonText="Add Year"
                onAddClick={() => setAddYearDialogOpen(true)}
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
                        <ActionDropdown 
                          onDelete={() => handleDeleteYear(row)} 
                          onEdit={() => handleEditYear(row)} 
                        />
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
          <MetricTable data={createPreNDAData(opportunity, { onEdit: handleEditField, onDelete: handleDeleteField })} />
        </div>

        <div className={COMMON_STYLES.section}>
          <SectionHeader
            addButtonText="Add Note"
            onAddClick={() => {}}
            showAddButton={true}
            title="Post-NDA"
          />
          <MetricTable data={createPostNDAData(opportunity, { onEdit: handleEditField, onDelete: handleDeleteField })} />
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

      <DescriptionEditDialog
        currentDescription={opportunity.description}
        onDescriptionUpdated={() => {
          // Optionally refresh data or show success message
        }}
        onOpenChange={setDescriptionDialogOpen}
        open={descriptionDialogOpen}
        opportunityId={opportunity._id}
      />

      <AddYearDialog
        existingYears={opportunity.graphRows?.map((row) => row.year) || []}
        onOpenChange={setAddYearDialogOpen}
        onYearAdded={() => {
          // Optionally refresh data or show success message
        }}
        open={addYearDialogOpen}
        opportunityId={opportunity._id}
      />

      <EditYearDialog
        currentData={selectedYearData || undefined}
        existingYears={opportunity.graphRows?.map((row) => row.year) || []}
        onOpenChange={setEditYearDialogOpen}
        onYearUpdated={() => {
          // Optionally refresh data or show success message
        }}
        open={editYearDialogOpen}
        opportunityId={opportunity._id}
      />

      <DeleteYearAlertDialog
        onOpenChange={setDeleteYearDialogOpen}
        onYearDeleted={() => {
          // Optionally refresh data or show success message
        }}
        open={deleteYearDialogOpen}
        opportunityId={opportunity._id}
        yearToDelete={selectedYearData?.year}
      />

      <EditFieldDialog
        currentValue={selectedFieldData?.value}
        fieldConfig={selectedFieldData ? {
          label: selectedFieldData.label,
          field: selectedFieldData.field,
          type: "text", // This will be determined by the field config in the component
        } : undefined}
        onFieldUpdated={() => {
          // Optionally refresh data or show success message
        }}
        onOpenChange={setEditFieldDialogOpen}
        open={editFieldDialogOpen}
        opportunityId={opportunity._id}
      />

      <DeleteFieldAlertDialog
        fieldLabel={selectedFieldData?.label}
        fieldName={selectedFieldData?.field}
        onFieldDeleted={() => {
          // Optionally refresh data or show success message
        }}
        onOpenChange={setDeleteFieldDialogOpen}
        open={deleteFieldDialogOpen}
        opportunityId={opportunity._id}
      />
    </div>
  );
};

export default Page;
