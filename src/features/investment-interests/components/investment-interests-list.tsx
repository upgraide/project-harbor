"use client";

import Link from "next/link";
import { EmptyView } from "@/components/entity-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useScopedI18n } from "@/locales/client";
import {
  backofficeMergeAndAcquisitionOpportunityPath,
  backofficeRealEstateOpportunityPath,
} from "@/paths";
import { useSuspenseInvestmentInterests } from "../hooks/use-investment-interests";
import { useInvestmentInterestsParams } from "../hooks/use-investment-interests-params";

export const InvestmentInterestsList = () => {
  const interests = useSuspenseInvestmentInterests();
  const t = useScopedI18n("backoffice.investment-interests");
  const [params, setParams] = useInvestmentInterestsParams();

  type InterestItem = (typeof interests.data.items)[number];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          onValueChange={(value) => {
            setParams({ type: value, page: 1 });
          }}
          value={params.type}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("filters.type.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.type.all")}</SelectItem>
            <SelectItem value="m&a">{t("filters.type.m&a")}</SelectItem>
            <SelectItem value="real-estate">
              {t("filters.type.real-estate")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            setParams({ status: value, page: 1 });
          }}
          value={params.status}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("filters.status.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.status.all")}</SelectItem>
            <SelectItem value="pending">
              {t("filters.status.pending")}
            </SelectItem>
            <SelectItem value="processed">
              {t("filters.status.processed")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {interests.data.items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <EmptyView message={t("emptyMessage")} title={t("emptyTitle")} />
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.clientName")}</TableHead>
                <TableHead>{t("table.project")}</TableHead>
                <TableHead>{t("table.interestType")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interests.data.items.map((interest: InterestItem) => (
                <TableRow key={interest.id}>
                  <TableCell className="font-medium">
                    {interest.userName}
                  </TableCell>
                  <TableCell>{interest.projectName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                      {interest.type === "m&a"
                        ? t("interestType.m&a")
                        : t("interestType.real-estate")}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(interest.date)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                      {interest.status === "pending"
                        ? t("status.pending")
                        : t("status.processed")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        className="text-primary text-sm hover:underline"
                        href={
                          interest.type === "m&a"
                            ? backofficeMergeAndAcquisitionOpportunityPath(
                                interest.projectId
                              )
                            : backofficeRealEstateOpportunityPath(
                                interest.projectId
                              )
                        }
                      >
                        {t("actions.viewDetails")}
                      </Link>
                      <button
                        className="text-left text-primary text-sm hover:underline"
                        type="button"
                      >
                        {t("actions.markAsProcessed")}
                      </button>
                      <button
                        className="text-left text-primary text-sm hover:underline"
                        type="button"
                      >
                        {t("actions.sendDocuments")}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
