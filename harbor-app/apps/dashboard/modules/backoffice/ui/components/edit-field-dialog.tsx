"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Button } from "@harbor-app/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@harbor-app/ui/components/dialog";
import { Input } from "@harbor-app/ui/components/input";
import { Label } from "@harbor-app/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@harbor-app/ui/components/select";
import { Switch } from "@harbor-app/ui/components/switch";
import { useMutation } from "convex/react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";

interface FieldConfig {
  label: string;
  field: string;
  type: "text" | "number" | "select" | "boolean";
  options?: { value: string; label: string }[];
  placeholder?: string;
  suffix?: string;
}

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldUpdated?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  fieldConfig?: FieldConfig;
  currentValue?: any;
}

const FIELD_CONFIGS: Record<string, FieldConfig> = {
  type: {
    label: "Type (Buy In/Buy Out)",
    field: "type",
    type: "select",
    options: [
      { value: "Buy In", label: "Buy In" },
      { value: "Buy Out", label: "Buy Out" },
    ],
  },
  typeDetails: {
    label: "Type Details",
    field: "typeDetails",
    type: "select",
    options: [
      { value: "Majority", label: "Majority" },
      { value: "Minority", label: "Minority" },
      { value: "Full", label: "Full" },
    ],
  },
  industry: {
    label: "Industry",
    field: "industry",
    type: "select",
    options: [
      { value: "Services", label: "Services" },
      { value: "Transformation Industry", label: "Transformation Industry" },
      { value: "Trading", label: "Trading" },
      { value: "Energy & Infrastructure", label: "Energy & Infrastructure" },
      { value: "Fitness", label: "Fitness" },
      { value: "Healthcare & Pharmaceuticals", label: "Healthcare & Pharmaceuticals" },
      { value: "IT", label: "IT" },
      { value: "TMT (Technology, Media & Telecommunications)", label: "TMT (Technology, Media & Telecommunications)" },
      { value: "Transports", label: "Transports" },
    ],
  },
  subIndustry: {
    label: "Sub Industry",
    field: "subIndustry",
    type: "text",
    placeholder: "Enter sub industry",
  },
  sales: {
    label: "Sales",
    field: "sales",
    type: "select",
    options: [
      { value: "0-5", label: "0-5" },
      { value: "5-10", label: "5-10" },
      { value: "10-15", label: "10-15" },
      { value: "20-30", label: "20-30" },
      { value: "30+", label: "30+" },
    ],
    suffix: "M€",
  },
  ebitda: {
    label: "EBITDA (Range)",
    field: "ebitda",
    type: "select",
    options: [
      { value: "1-2", label: "1-2" },
      { value: "2-3", label: "2-3" },
      { value: "3-5", label: "3-5" },
      { value: "5+", label: "5+" },
    ],
    suffix: "M€",
  },
  ebitdaNormalized: {
    label: "EBITDA (Normalized)",
    field: "ebitdaNormalized",
    type: "number",
    placeholder: "Enter normalized EBITDA",
    suffix: "M€",
  },
  netDebt: {
    label: "Net Debt",
    field: "netDebt",
    type: "number",
    placeholder: "Enter net debt",
    suffix: "M€",
  },
  salesCAGR: {
    label: "Sales CAGR",
    field: "salesCAGR",
    type: "number",
    placeholder: "Enter sales CAGR",
    suffix: "%",
  },
  ebitdaCAGR: {
    label: "EBITDA CAGR",
    field: "ebitdaCAGR",
    type: "number",
    placeholder: "Enter EBITDA CAGR",
    suffix: "%",
  },
  assetIncluded: {
    label: "Asset Included",
    field: "assetIncluded",
    type: "boolean",
  },
  assetValue: {
    label: "Asset Value",
    field: "assetValue",
    type: "number",
    placeholder: "Enter asset value",
    suffix: "M€",
  },
  entrepriveValue: {
    label: "Entreprive Value",
    field: "entrepriveValue",
    type: "number",
    placeholder: "Enter entreprive value",
    suffix: "M€",
  },
  equityValue: {
    label: "Equity Value",
    field: "equityValue",
    type: "number",
    placeholder: "Enter equity value",
    suffix: "M€",
  },
  evDashEbitdaEntry: {
    label: "EV/EBITDA (Entry)",
    field: "evDashEbitdaEntry",
    type: "number",
    placeholder: "Enter EV/EBITDA entry",
    suffix: "x",
  },
  evDashEbitdaExit: {
    label: "EV/EBITDA (Exit)",
    field: "evDashEbitdaExit",
    type: "number",
    placeholder: "Enter EV/EBITDA exit",
    suffix: "x",
  },
  ebitdaMargin: {
    label: "EBITDA Margin",
    field: "ebitdaMargin",
    type: "number",
    placeholder: "Enter EBITDA margin",
    suffix: "%",
  },
  freeCashFlow: {
    label: "Free Cash Flow (FCF)",
    field: "freeCashFlow",
    type: "number",
    placeholder: "Enter free cash flow",
    suffix: "M€",
  },
  netDebtDashEbitda: {
    label: "Net Debt/EBITDA",
    field: "netDebtDashEbitda",
    type: "number",
    placeholder: "Enter net debt/EBITDA",
  },
  capexIntensity: {
    label: "Capex Intensity",
    field: "capexIntensity",
    type: "number",
    placeholder: "Enter capex intensity",
    suffix: "%",
  },
  workingCapitalNeeds: {
    label: "Working Capital Needs",
    field: "workingCapitalNeeds",
    type: "number",
    placeholder: "Enter working capital needs",
    suffix: "M€",
  },
};

export const EditFieldDialog = ({
  open,
  onOpenChange,
  onFieldUpdated,
  opportunityId,
  fieldConfig,
  currentValue,
}: EditFieldDialogProps) => {
  const [formValue, setFormValue] = useState<string>("");
  const updateField = useMutation(api.private.mergersAndAcquisitionsOpportunities.updateOpportunityField);

  // Transitions
  const [isUpdating, startTransition] = useTransition();

  // Get the actual field config from the predefined configs
  const actualFieldConfig = fieldConfig ? FIELD_CONFIGS[fieldConfig.field] || fieldConfig : undefined;

  // Update form value when currentValue or fieldConfig changes
  useEffect(() => {
    if (actualFieldConfig && currentValue !== undefined) {
      if (actualFieldConfig.type === "boolean") {
        setFormValue(currentValue ? "true" : "false");
      } else {
        setFormValue(currentValue?.toString() || "");
      }
    }
  }, [currentValue, actualFieldConfig]);

  const handleUpdateField = async () => {
    if (!actualFieldConfig) {
      toast.error("No field configuration provided");
      return;
    }

    let processedValue: any = formValue;

    // Process value based on field type
    if (actualFieldConfig.type === "number") {
      if (formValue.trim() === "") {
        processedValue = null;
      } else {
        const numValue = parseFloat(formValue);
        if (isNaN(numValue)) {
          toast.error("Please enter a valid number");
          return;
        }
        processedValue = numValue;
      }
    } else if (actualFieldConfig.type === "boolean") {
      processedValue = formValue === "true";
    } else if (actualFieldConfig.type === "text" && formValue.trim() === "") {
      processedValue = null;
    }

    startTransition(async () => {
      try {
        await updateField({
          opportunityId,
          field: actualFieldConfig.field,
          value: processedValue,
        });

        onFieldUpdated?.();
        handleCancel();
        toast.success("Field updated successfully");
      } catch (error) {
        console.error("Failed to update field:", error);
        toast.error("Failed to update field");
      }
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (actualFieldConfig && currentValue !== undefined) {
      if (actualFieldConfig.type === "boolean") {
        setFormValue(currentValue ? "true" : "false");
      } else {
        setFormValue(currentValue?.toString() || "");
      }
    }
  };

  const handleInputChange = (value: string) => {
    setFormValue(value);
  };

  const isFormValid = formValue.trim() !== "" || actualFieldConfig?.type === "number";

  if (!actualFieldConfig) {
    return null;
  }

  const renderInput = () => {
    switch (actualFieldConfig.type) {
      case "select":
        return (
          <Select value={formValue} onValueChange={handleInputChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${actualFieldConfig.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {actualFieldConfig.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={formValue === "true"}
              onCheckedChange={(checked) => setFormValue(checked ? "true" : "false")}
            />
            <Label>{formValue === "true" ? "Yes" : "No"}</Label>
          </div>
        );
      case "number":
        return (
          <Input
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={actualFieldConfig.placeholder}
            type="number"
            value={formValue}
          />
        );
      default:
        return (
          <Input
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={actualFieldConfig.placeholder}
            type="text"
            value={formValue}
          />
        );
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {actualFieldConfig.label}</DialogTitle>
          <DialogDescription>
            Update the {actualFieldConfig.label.toLowerCase()} value
            {actualFieldConfig.suffix && ` (${actualFieldConfig.suffix})`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-value">{actualFieldConfig.label}</Label>
            {renderInput()}
            {actualFieldConfig.suffix && (
              <p className="text-sm text-muted-foreground">
                Value will be displayed with suffix: {actualFieldConfig.suffix}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={isUpdating}
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isUpdating || (actualFieldConfig.type !== "number" && !isFormValid)}
            onClick={handleUpdateField}
          >
            {isUpdating ? "Updating..." : "Update Field"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
