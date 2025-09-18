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
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearAdded?: () => void;
  opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  existingYears?: number[];
}

export const AddYearDialog = ({
  open,
  onOpenChange,
  onYearAdded,
  opportunityId,
  existingYears = [],
}: AddYearDialogProps) => {
  const [formData, setFormData] = useState({
    year: "",
    revenue: "",
    ebitda: "",
  });
  const addGraphRow = useMutation(
    api.private.mergersAndAcquisitionsOpportunities.addGraphRow,
  );

  // Transitions
  const [isAdding, startTransition] = useTransition();

  const handleAddYear = async () => {
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

    if (existingYears.includes(year)) {
      toast.error("This year already exists in the graph data");
      return;
    }

    startTransition(async () => {
      try {
        await addGraphRow({
          opportunityId,
          year,
          revenue,
          ebitda,
        });

        onYearAdded?.();
        handleCancel();
        toast.success("Year added successfully");
      } catch (error) {
        console.error("Failed to add year:", error);
        toast.error("Failed to add year");
      }
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      year: "",
      revenue: "",
      ebitda: "",
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form when dialog opens
  useState(() => {
    if (open) {
      setFormData({
        year: "",
        revenue: "",
        ebitda: "",
      });
    }
  });

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
          <DialogTitle>Add Year to Chart</DialogTitle>
          <DialogDescription>
            Add a new year with revenue and EBITDA data to the financial performance chart
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
            disabled={isAdding}
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isAdding || !isFormValid}
            onClick={handleAddYear}
          >
            {isAdding ? "Adding..." : "Add Year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
