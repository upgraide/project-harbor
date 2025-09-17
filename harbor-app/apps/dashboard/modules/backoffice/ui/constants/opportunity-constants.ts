import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";

export const CHART_CONFIG = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  ebitda: {
    label: "EBITDA",
    color: "var(--chart-2)",
  },
} as const;

export const COMMON_STYLES = {
  section: "mt-8 rounded-lg border border-border bg-background",
  tableRow: "hover:bg-muted/50",
  headerRow: "font-medium bg-muted/50",
  cell: "px-6 py-4",
  mutedText: "text-muted-foreground",
} as const;

export const ACTION_HANDLERS = {
  addImage: () => console.log("Add image"),
  editDescription: () => console.log("Edit description"),
  addYear: () => console.log("Add year"),
  addNote: () => console.log("Add note"),
  editMetric: () => console.log("Edit metric"),
  deleteMetric: () => console.log("Delete metric"),
  deleteImage: (imageUrl: string) => console.log("Delete image", imageUrl),
} as const;

export type OpportunityData = {
  _id: Id<"opportunitiesMergersAndAcquisitions">;
  name: string;
  description?: string;
  imagesURLs?: string[];
  graphRows?: Array<{
    year: number;
    revenue: number;
    ebitda: number;
  }>;
  type: string;
  typeDetails: string;
  industry: string;
  subIndustry?: string;
  sales: string | number;
  ebitda: string | number;
  ebitdaNormalized?: number;
  netDebt?: number;
  salesCAGR?: number;
  ebitdaCAGR?: number;
  assetIncluded?: boolean;
  assetValue?: number;
  entrepriveValue?: number;
  equityValue?: number;
  evDashEbitdaEntry?: number;
  evDashEbitdaExit?: number;
  ebitdaMargin?: number;
  freeCashFlow?: number;
  netDebtDashEbitda?: number;
  capexIntensity?: number;
  workingCapitalNeeds?: number;
};
