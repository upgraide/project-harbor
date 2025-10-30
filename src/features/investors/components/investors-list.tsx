"use client";

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
import { useSuspenseInvestors } from "../hooks/use-investors";
import { useInvestorsParams } from "../hooks/use-investors-params";
import { InvestorsSearch } from "./investors-search";

export const InvestorsList = () => {
  const investors = useSuspenseInvestors();
  const t = useScopedI18n("backoffice.investors");
  const [params, setParams] = useInvestorsParams();

  type InvestorItem = (typeof investors.data.items)[number];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              setParams({ investorType: value, page: 1 });
            }}
            value={params.investorType}
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
              setParams({ interestSegment: value, page: 1 });
            }}
            value={params.interestSegment}
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
              setParams({ industry: value, page: 1 });
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
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.investorType")}</TableHead>
                <TableHead>{t("table.interestSegments")}</TableHead>
                <TableHead>{t("table.interestSubcategories")}</TableHead>
                <TableHead>{t("table.preferredLocation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.data.items.map((investor: InvestorItem) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>{investor.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                      {investor.investorType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {investor.interestSegments.map((segment) => (
                        <span
                          className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs"
                          key={segment}
                        >
                          {segment}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {investor.interestSubcategories.map((subcategory) => (
                        <span
                          className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs"
                          key={subcategory}
                        >
                          {subcategory}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{investor.preferredLocation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
