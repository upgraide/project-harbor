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
import { useMutation } from "convex/react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";

interface EditYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearUpdated?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  existingYears?: number[];
  currentData?: {
    year: number;
    revenue: number;
    ebitda: number;
  };
}

export const EditYearDialog = ({
  open,
  onOpenChange,
  onYearUpdated,
  opportunityId,
  existingYears = [],
  currentData,
}: EditYearDialogProps) => {
  const [formData, setFormData] = useState({
    year: "",
    revenue: "",
    ebitda: "",
  });
  const updateGraphRow = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.updateGraphRow,
  );

  // Transitions
  const [isUpdating, startTransition] = useTransition();

  // Update form data when currentData changes
  useEffect(() => {
    if (currentData) {
      setFormData({
        year: currentData.year.toString(),
        revenue: currentData.revenue.toString(),
        ebitda: currentData.ebitda.toString(),
      });
    }
  }, [currentData]);

  const handleUpdateYear = async () => {
    const year = parseInt(formData.year);
    const revenue = parseFloat(formData.revenue);
    const ebitda = parseFloat(formData.ebitda);

    // Validation
    if (isNaN(year) || year < 1900 || year > 2100) {
      toast.error("Please enter a valid year between 1900 and 2100");
      return;
    }

    if (isNaN(revenue) || revenue < 0) {
      toast.error("Please enter a valid revenue value (must be positive)");
      return;
    }

    if (isNaN(ebitda)) {
      toast.error("Please enter a valid EBITDA value");
      return;
    }

    // Check if year already exists (excluding current year)
    const currentYear = currentData?.year;
    if (year !== currentYear && existingYears.includes(year)) {
      toast.error("This year already exists in the graph data");
      return;
    }

    if (!currentData) {
      toast.error("No data to update");
      return;
    }

    startTransition(async () => {
      try {
        await updateGraphRow({
          opportunityId,
          oldYear: currentData.year,
          newYear: year,
          revenue,
          ebitda,
        });

        onYearUpdated?.();
        handleCancel();
        toast.success("Year updated successfully");
      } catch (error) {
        console.error("Failed to update year:", error);
        toast.error("Failed to update year");
      }
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (currentData) {
      setFormData({
        year: currentData.year.toString(),
        revenue: currentData.revenue.toString(),
        ebitda: currentData.ebitda.toString(),
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.year.trim() !== "" &&
    formData.revenue.trim() !== "" &&
    formData.ebitda.trim() !== "" &&
    !isNaN(parseInt(formData.year)) &&
    !isNaN(parseFloat(formData.revenue)) &&
    !isNaN(parseFloat(formData.ebitda));

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Year Data</DialogTitle>
          <DialogDescription>
            Update the year, revenue, and EBITDA data for this chart entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              onChange={(e) => handleInputChange("year", e.target.value)}
              placeholder="e.g., 2024"
              type="number"
              value={formData.year}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <Input
              id="revenue"
              onChange={(e) => handleInputChange("revenue", e.target.value)}
              placeholder="e.g., 1000000"
              type="number"
              value={formData.revenue}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ebitda">EBITDA</Label>
            <Input
              id="ebitda"
              onChange={(e) => handleInputChange("ebitda", e.target.value)}
              placeholder="e.g., 200000"
              type="number"
              value={formData.ebitda}
            />
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
            disabled={isUpdating || !isFormValid}
            onClick={handleUpdateYear}
          >
            {isUpdating ? "Updating..." : "Update Year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
