"use client";

import { FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Department,
  LeadPriority,
  LeadSource,
  LeadStatus,
} from "@/generated/prisma";
import { useScopedI18n } from "@/locales/client";

export type LeadFilters = {
  leadSource?: LeadSource;
  assignedTo?: string;
  department?: Department;
  status?: LeadStatus;
  priority?: LeadPriority;
  lastContactDateFrom?: string;
  lastContactDateTo?: string;
};

type LeadsFiltersProps = {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  teamMembers?: Array<{ id: string; name: string; email: string }>;
};

export const LeadsFilters = ({
  filters,
  onFiltersChange,
  teamMembers = [],
}: LeadsFiltersProps) => {
  const t = useScopedI18n("crm.leads");
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onFiltersChange({});
  };

  const updateFilter = <K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ""
  ).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          {t("filters.title")}
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          {t("filters.title")}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-auto p-0 text-xs"
            >
              {t("filters.reset")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="grid gap-4 p-4">
          {/* Lead Source */}
          <div className="grid gap-2">
            <Label htmlFor="leadSource">{t("filters.leadSource")}</Label>
            <Select
              value={filters.leadSource || ""}
              onValueChange={(value) =>
                updateFilter("leadSource", value as LeadSource)
              }
            >
              <SelectTrigger id="leadSource">
                <SelectValue placeholder={t("filters.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("filters.all")}
                </SelectItem>
                <SelectItem value="WEBSITE">
                  {t("leadSource.WEBSITE")}
                </SelectItem>
                <SelectItem value="REFERRAL">
                  {t("leadSource.REFERRAL")}
                </SelectItem>
                <SelectItem value="COLD_OUTREACH">
                  {t("leadSource.COLD_OUTREACH")}
                </SelectItem>
                <SelectItem value="NETWORKING_EVENT">
                  {t("leadSource.NETWORKING_EVENT")}
                </SelectItem>
                <SelectItem value="LINKEDIN">
                  {t("leadSource.LINKEDIN")}
                </SelectItem>
                <SelectItem value="EMAIL_CAMPAIGN">
                  {t("leadSource.EMAIL_CAMPAIGN")}
                </SelectItem>
                <SelectItem value="PARTNER">
                  {t("leadSource.PARTNER")}
                </SelectItem>
                <SelectItem value="EXISTING_CLIENT">
                  {t("leadSource.EXISTING_CLIENT")}
                </SelectItem>
                <SelectItem value="ACCESS_REQUEST">
                  {t("leadSource.ACCESS_REQUEST")}
                </SelectItem>
                <SelectItem value="OTHER">
                  {t("leadSource.OTHER")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">{t("filters.status")}</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) =>
                updateFilter("status", value as LeadStatus)
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("filters.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("filters.all")}
                </SelectItem>
                <SelectItem value="NEW">{t("leadStatus.NEW")}</SelectItem>
                <SelectItem value="CONTACTED">
                  {t("leadStatus.CONTACTED")}
                </SelectItem>
                <SelectItem value="QUALIFIED">
                  {t("leadStatus.QUALIFIED")}
                </SelectItem>
                <SelectItem value="MEETING_SCHEDULED">
                  {t("leadStatus.MEETING_SCHEDULED")}
                </SelectItem>
                <SelectItem value="PROPOSAL_SENT">
                  {t("leadStatus.PROPOSAL_SENT")}
                </SelectItem>
                <SelectItem value="NEGOTIATION">
                  {t("leadStatus.NEGOTIATION")}
                </SelectItem>
                <SelectItem value="CONVERTED">
                  {t("leadStatus.CONVERTED")}
                </SelectItem>
                <SelectItem value="LOST">{t("leadStatus.LOST")}</SelectItem>
                <SelectItem value="ON_HOLD">
                  {t("leadStatus.ON_HOLD")}
                </SelectItem>
                <SelectItem value="NURTURE">
                  {t("leadStatus.NURTURE")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label htmlFor="priority">{t("filters.priority")}</Label>
            <Select
              value={filters.priority || ""}
              onValueChange={(value) =>
                updateFilter("priority", value as LeadPriority)
              }
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={t("filters.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("filters.all")}
                </SelectItem>
                <SelectItem value="URGENT">
                  {t("leadPriority.URGENT")}
                </SelectItem>
                <SelectItem value="HIGH">{t("leadPriority.HIGH")}</SelectItem>
                <SelectItem value="MEDIUM">
                  {t("leadPriority.MEDIUM")}
                </SelectItem>
                <SelectItem value="LOW">{t("leadPriority.LOW")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="grid gap-2">
            <Label htmlFor="department">{t("filters.department")}</Label>
            <Select
              value={filters.department || ""}
              onValueChange={(value) =>
                updateFilter("department", value as Department)
              }
            >
              <SelectTrigger id="department">
                <SelectValue placeholder={t("filters.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("filters.all")}
                </SelectItem>
                <SelectItem value="MNA">{t("department.MNA")}</SelectItem>
                <SelectItem value="CRE">{t("department.CRE")}</SelectItem>
                <SelectItem value="MNA_AND_CRE">
                  {t("department.MNA_AND_CRE")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">{t("filters.assignedTo")}</Label>
            <Select
              value={filters.assignedTo || ""}
              onValueChange={(value) => updateFilter("assignedTo", value)}
            >
              <SelectTrigger id="assignedTo">
                <SelectValue placeholder={t("filters.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("filters.all")}
                </SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid gap-2">
            <Label>{t("filters.lastContactDate")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.lastContactDateFrom || ""}
                onChange={(e) =>
                  updateFilter("lastContactDateFrom", e.target.value)
                }
              />
              <Input
                type="date"
                value={filters.lastContactDateTo || ""}
                onChange={(e) =>
                  updateFilter("lastContactDateTo", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
