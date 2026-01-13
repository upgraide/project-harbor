"use client";

import { useState } from "react";
import { EmptyView } from "@/components/entity-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentUserRole } from "@/features/users/hooks/use-current-user-role";
import { Role } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { useDeleteInvestor } from "../hooks/use-delete-investor";
import { useSuspenseInvestors } from "../hooks/use-investors";
import { useInvestorsParams } from "../hooks/use-investors-params";
import { EditInvestorDialog } from "./edit-investor-dialog";
import { InvestorTableRow } from "./investor-table-row";
import { InvestorsSearch } from "./investors-search";

export const InvestorsList = () => {
  const { open } = useSidebar();
  const investors = useSuspenseInvestors();
  const t = useScopedI18n("backoffice.investors");
  const [params, setParams] = useInvestorsParams();
  const deleteInvestor = useDeleteInvestor();
  const { data: currentUserRole } = useCurrentUserRole();
  const isAdmin = currentUserRole === Role.ADMIN;
  const [editingInvestorId, setEditingInvestorId] = useState<string | null>(
    null
  );

  type InvestorItem = (typeof investors.data.items)[number];

  const handleDelete = (investorId: string) => {
    deleteInvestor.mutate({ id: investorId });
  };

  return (
    <>
      {editingInvestorId && (
        <EditInvestorDialog
          investorId={editingInvestorId}
          onOpenChangeAction={(o) => {
            if (!o) {
              setEditingInvestorId(null);
            }
          }}
          open={!!editingInvestorId}
        />
      )}
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <Select
              onValueChange={(value) => {
                setParams({
                  ...params,
                  investorType: value as
                    | "all"
                    | "<€10M"
                    | "€10M-€100M"
                    | ">€100M",
                  page: 1,
                });
              }}
              value={params.investorType ?? "all"}
            >
              <SelectTrigger className="w-fit">
                <SelectValue
                  placeholder={t("filters.investorType.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.investorType.all")}
                </SelectItem>
                <SelectItem value="<€10M">
                  {t("filters.investorType.<€10M")}
                </SelectItem>
                <SelectItem value="€10M-€100M">
                  {t("filters.investorType.€10M-€100M")}
                </SelectItem>
                <SelectItem value=">€100M">
                  {t("filters.investorType.>€100M")}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                setParams({
                  ...params,
                  interestSegment: value as "all" | "CRE" | "M&A",
                  page: 1,
                });
              }}
              value={params.interestSegment ?? "all"}
            >
              <SelectTrigger className="w-fit">
                <SelectValue
                  placeholder={t("filters.interestSegment.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("filters.interestSegment.all")}
                </SelectItem>
                <SelectItem value="CRE">
                  {t("filters.interestSegment.CRE")}
                </SelectItem>
                <SelectItem value="M&A">
                  {t("filters.interestSegment.M&A")}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                setParams({ ...params, industry: value, page: 1 });
              }}
              value={params.industry}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder={t("filters.industry.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.industry.all")}</SelectItem>
                {/* Add industry options here if needed */}
              </SelectContent>
            </Select>
          </div>
          <InvestorsSearch />
        </div>

        {investors.data.items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <EmptyView message={t("emptyMessage")} title={t("emptyTitle")} />
          </div>
        ) : (
          <div
            className={cn(
              "w-full overflow-x-auto rounded-lg border",
              open ? "max-w-6xl" : "max-w-full"
            )}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 min-w-[150px] bg-background">
                    {t("table.companyName")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.name")}
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    {t("table.email")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.representativeName")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.phoneNumber")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.type")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.investorType")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.department")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.strategy1")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.segment1")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.strategy2")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.segment2")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.strategy3")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.segment3")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.location1")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.location2")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.location3")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.preferredLocation")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.minTicketSize")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.maxTicketSize")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.targetReturnIRR")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.leadResponsible")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.leadResponsibleTeam")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.leadMainContact")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.leadMainContactTeam")}
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    {t("table.physicalAddress")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.website")}
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    {t("table.lastContactDate")}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t("table.acceptMarketingList")}
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    {t("table.otherFacts")}
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    {t("table.lastNotes")}
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    {t("table.interestSegments")}
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    {t("table.interestSubcategories")}
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="sticky right-0 min-w-[100px] bg-background">
                      {t("table.actions")}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.data.items.map((investor: InvestorItem) => (
                  <InvestorTableRow
                    investor={investor}
                    isAdmin={isAdmin}
                    isDeleting={deleteInvestor.isPending}
                    key={investor.id}
                    onDelete={handleDelete}
                    onEdit={setEditingInvestorId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};
