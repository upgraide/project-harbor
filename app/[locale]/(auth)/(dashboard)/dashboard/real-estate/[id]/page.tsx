/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: Rewriting the page to use the new components */
/** biome-ignore-all lint/style/noMagicNumbers: Rewriting the page to use the new components */
"use client";

import { useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { LocationMap } from "@/components/location-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useScopedI18n } from "@/locales/client";

const Page = ({ params }: { params: Promise<{ id: Id<"realEstates"> }> }) => {
  const { id } = use(params);
  const t = useScopedI18n("dashboardRealEstateOpportunityPage");

  const opportunity = useQuery(api.realEstates.getById, {
    id,
  });

  if (!opportunity) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 mb-6 w-full space-y-6 px-4 md:max-w-7xl">
      <h1 className="mt-6 font-bold text-2xl md:text-4xl">
        {opportunity.name}
      </h1>

      {opportunity.imagesUrls && opportunity.imagesUrls.length > 0 && (
        <>
          <div className="w-full">
            <Image
              alt="Opportunity Image 1"
              className="h-64 w-full object-cover md:h-96"
              height={4501}
              src={opportunity.imagesUrls[0] ?? ""}
              width={4501}
            />
          </div>

          {opportunity.imagesUrls.length > 1 && (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
              {opportunity.imagesUrls.slice(1, 4).map((imageUrl, index) => (
                <div key={index + 1}>
                  <Image
                    alt={`Opportunity Image ${index + 2}`}
                    className="h-48 w-full object-cover md:h-48"
                    height={200}
                    src={imageUrl ?? ""}
                    width={300}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Card className="bg-background shadow-none">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-semibold text-xl">
            {t("description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-balance text-muted-foreground text-sm">
            {opportunity.description}
          </p>
        </CardContent>
      </Card>

      {opportunity.location && (
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semibold text-xl">
              {t("financialInformationCard.table.metrics.location")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LocationMap
              className="h-96 w-full"
              location={opportunity.location}
            />
          </CardContent>
        </Card>
      )}

      <Card className="border-none bg-background shadow-none">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-semibold text-xl">
            {t("financialInformationCard.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6 py-4">
                  {t("financialInformationCard.table.header.metric")}
                </TableHead>
                <TableHead className="px-6 py-4">
                  {t("financialInformationCard.table.header.value")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunity.asset ? (
                <TableRow key={"asset"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.asset")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {(() => {
                      if (opportunity.asset === "Agnostic") {
                        return t(
                          "financialInformationCard.table.values.agnostic"
                        );
                      }
                      if (opportunity.asset === "Hospitality") {
                        return t(
                          "financialInformationCard.table.values.hospitality"
                        );
                      }
                      if (opportunity.asset === "Logistics & Industrial") {
                        return t(
                          "financialInformationCard.table.values.logisticsIndustrial"
                        );
                      }
                      if (opportunity.asset === "Office") {
                        return t(
                          "financialInformationCard.table.values.office"
                        );
                      }
                      if (opportunity.asset === "Residential") {
                        return t(
                          "financialInformationCard.table.values.residential"
                        );
                      }
                      if (opportunity.asset === "Senior Living") {
                        return t(
                          "financialInformationCard.table.values.seniorLiving"
                        );
                      }
                      if (opportunity.asset === "Shopping Center") {
                        return t(
                          "financialInformationCard.table.values.shoppingCenters"
                        );
                      }
                      if (opportunity.asset === "Student Housing") {
                        return t(
                          "financialInformationCard.table.values.studentHousing"
                        );
                      }
                      // For "Mixed" and "Street Retail" which should not be translated according to the image
                      return opportunity.asset;
                    })()}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
              ) : null}
              {opportunity.nRoomsLastYear ? (
                <TableRow key={"nRoomsLastYear"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.nRoomsLastYear")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nRoomsLastYear}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.noi ? (
                <TableRow key={"noi"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.noi")}
                  </TableCell>
                  <TableCell className="px-6 py-4">{opportunity.noi}</TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.occupancyLastYear ? (
                <TableRow key={"occupancyLastYear"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.metrics.occupancyLastYear"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyLastYear}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.walt ? (
                <TableRow key={"walt"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.walt")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.walt}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.nBeds ? (
                <TableRow key={"nBeds"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.nBeds")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nBeds}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.investment ? (
                <TableRow key={"investment"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.investment")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {(() => {
                      if (opportunity.investment === "Lease and Operation") {
                        return t(
                          "financialInformationCard.table.values.leaseAndOperation"
                        );
                      }
                      if (opportunity.investment === "S&L") {
                        return t("financialInformationCard.table.values.sAndL");
                      }
                      if (opportunity.investment === "Core") {
                        return t("financialInformationCard.table.values.core");
                      }
                      if (opportunity.investment === "Fix&Flip") {
                        return t(
                          "financialInformationCard.table.values.fixAndFlip"
                        );
                      }
                      if (opportunity.investment === "Refurbishment") {
                        return t(
                          "financialInformationCard.table.values.refurbishment"
                        );
                      }
                      if (opportunity.investment === "Value-add") {
                        return t(
                          "financialInformationCard.table.values.valueAdd"
                        );
                      }
                      if (opportunity.investment === "Opportunistic") {
                        return t(
                          "financialInformationCard.table.values.opportunistic"
                        );
                      }
                      if (opportunity.investment === "Development") {
                        return t(
                          "financialInformationCard.table.values.development"
                        );
                      }
                      return opportunity.investment;
                    })()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.subRent ? (
                <TableRow key={"subRent"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.subRent")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subRent}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.rentPerSqm ? (
                <TableRow key={"rentPerSqm"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.rentPerSqm")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rentPerSqm}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.subYield ? (
                <TableRow key={"subYield"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.subYield")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subYield} %
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.capex ? (
                <TableRow key={"capex"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.capex")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capex}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.capexPerSqm ? (
                <TableRow key={"capexPerSqm"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.capexPerSqm")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexPerSqm}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.sale ? (
                <TableRow key={"sale"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.sale")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sale}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.salePerSqm ? (
                <TableRow key={"salePerSqm"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.salePerSqm")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salePerSqm}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.location ? (
                <TableRow key={"location"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.location")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.location}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.area ? (
                <TableRow key={"area"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.area")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.area} m²
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.value ? (
                <TableRow key={"value"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.value")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.value} M€
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.yield ? (
                <TableRow key={"yield"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.yield")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yield} %
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.rent ? (
                <TableRow key={"rent"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.rent")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rent} M€/year
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.gcaAboveGround ? (
                <TableRow key={"gcaAboveGround"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.gcaAboveGround")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaAboveGround} m²
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.gcaBelowGround ? (
                <TableRow key={"gcaBelowGround"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.gcaBelowGround")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaBelowGround} m²
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.licenseStage ? (
                <TableRow key={"licenseStage"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.licensingStage")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.licenseStage}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.holdingPeriod ? (
                <TableRow key={"holdingPeriod"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.metrics.holdPeriodYears"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdingPeriod}{" "}
                    {t("financialInformationCard.table.metrics.years")}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.breakEvenOccupancy ? (
                <TableRow key={"breakEvenOccupancy"}>
                  <TableCell className="px-6 py-4">
                    {t(
                      "financialInformationCard.table.metrics.breakEvenOccupancy"
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.breakEvenOccupancy}%
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.occupancyRate ? (
                <TableRow key={"occupancyRate"}>
                  <TableCell className="px-6 py-4">
                    {t("financialInformationCard.table.metrics.occupancyRate")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyRate}%
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {opportunity.coInvestment && (
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-semibold text-xl">
              Co-Investment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.metric")}
                  </TableHead>
                  <TableHead className="px-6 py-4">
                    {t("financialInformationCard.table.header.value")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunity.gpEquityValue ? (
                  <TableRow key={"gpEquityValue"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.gpEquity")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.gpEquityValue} M€
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.totalEquityRequired ? (
                  <TableRow key={"totalEquityRequired"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.totalEquityRequired"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.totalEquityRequired} M€
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.sponsorPresentation ? (
                  <TableRow key={"sponsorPresentation"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.sponsorPresentation"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.sponsorPresentation}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.promoteStructure ? (
                  <TableRow key={"promoteStructure"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.promoteStructure"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.promoteStructure}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.projectIRR ? (
                  <TableRow key={"projectIRR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.projectIRR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.projectIRR}%
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.investorIRR ? (
                  <TableRow key={"investorIRR"}>
                    <TableCell className="px-6 py-4">
                      {t("financialInformationCard.table.metrics.investorIRR")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.investorIRR}%
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.coInvestmentHoldPeriod ? (
                  <TableRow key={"coInvestmentHoldPeriod"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.coInvestmentHoldPeriod"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coInvestmentHoldPeriod}{" "}
                      {t("financialInformationCard.table.metrics.years")}
                    </TableCell>
                  </TableRow>
                ) : null}
                {opportunity.coInvestmentBreakEvenOccupancy ? (
                  <TableRow key={"coInvestmentBreakEvenOccupancy"}>
                    <TableCell className="px-6 py-4">
                      {t(
                        "financialInformationCard.table.metrics.coInvestmentBreakEvenOccupancy"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coInvestmentBreakEvenOccupancy}%
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Button size={"lg"}>{t("actionButtons.interestToInvest")}</Button>
        {opportunity.coInvestment === true ? (
          <Button size={"lg"} variant={"outline"}>
            {t("actionButtons.coInvest")}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
