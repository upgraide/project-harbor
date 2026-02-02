"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerformanceFilters } from "@/features/opportunities/context/performance-filters";
import { useLeadResponsibles } from "@/features/opportunities/hooks/use-performance";
import { useScopedI18n } from "@/locales/client";

export const PerformanceFilters = () => {
  const t = useScopedI18n("backoffice.analytics.performance.filters");
  const { filters, setLeadResponsibleId, resetFilters } = usePerformanceFilters();

  const { data: leadResponsibles, isLoading: isLoadingLeadResponsibles } = useLeadResponsibles();

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Lead Responsible Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("leadResponsible")}</label>
        <Select
          value={filters.leadResponsibleId ?? "all"}
          onValueChange={(value) => setLeadResponsibleId(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("leadResponsiblePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("leadResponsiblePlaceholder")}</SelectItem>
            {isLoadingLeadResponsibles ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              leadResponsibles?.map((responsible: { id: string; name: string | null }) => (
                <SelectItem key={responsible.id} value={responsible.id}>
                  {responsible.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium invisible">Reset</label>
        <Button variant="outline" size="icon" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
