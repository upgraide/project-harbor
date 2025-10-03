/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <explanation> */
"use client";

import { useQuery } from "convex/react";
import { LoaderIcon, PencilIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
import { backofficeRealEstatePath } from "@/lib/paths";

const Page = ({ params }: { params: Promise<{ id: Id<"realEstates"> }> }) => {
  const { id } = use(params);

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
    <SidebarInset className="bg-muted">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={backofficeRealEstatePath()}>
                Real Estate Opportunities
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{opportunity.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="mx-auto mt-6 mb-6 w-full space-y-6 md:max-w-screen-md">
        <h1 className="mt-6 font-bold text-2xl md:text-4xl">
          {opportunity.name}
        </h1>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              Opportunity Images
            </CardTitle>
            <Button variant="outline">
              <PlusIcon className="size-4" />
              Add Image
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            {opportunity.imagesUrls?.map((imageUrl, index) => (
              <div key={index}>
                <Image
                  alt={`Opportunity Image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  height={4501}
                  src={imageUrl ?? ""}
                  width={4501}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">Description</CardTitle>
            <Button variant="outline">
              <PencilIcon className="size-4" />
              Edit Description
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {opportunity.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              Pre-NDA Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {" "}
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"type"}>
                  <TableCell className="px-6 py-4">Asset</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.asset ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"nRoomsLastYear"}>
                  <TableCell className="px-6 py-4">
                    Number Rooms Last Year
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nRoomsLastYear ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"noi"}>
                  <TableCell className="px-6 py-4">NOI</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.noi ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"occupancyLastYear"}>
                  <TableCell className="px-6 py-4">
                    Occupancy Last Year
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyLastYear ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"walt"}>
                  <TableCell className="px-6 py-4">WALT</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.walt ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"nBeds"}>
                  <TableCell className="px-6 py-4">Number of Beds</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nBeds ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"investment"}>
                  <TableCell className="px-6 py-4">Investment</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.investment ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"subRent"}>
                  <TableCell className="px-6 py-4">Sub Rent</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subRent ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"rentPerSqm"}>
                  <TableCell className="px-6 py-4">Rent Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rentPerSqm ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"subYield"}>
                  <TableCell className="px-6 py-4">Sub Yield</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subYield ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"capex"}>
                  <TableCell className="px-6 py-4">Capex</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capex ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"capexPerSqm"}>
                  <TableCell className="px-6 py-4">Capex Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexPerSqm ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"sale"}>
                  <TableCell className="px-6 py-4">Sale</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sale ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"salePerSqm"}>
                  <TableCell className="px-6 py-4">Sale Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salePerSqm ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"location"}>
                  <TableCell className="px-6 py-4">Location</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.location ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"area"}>
                  <TableCell className="px-6 py-4">Area</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.area ? `${opportunity.area} m²` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"value"}>
                  <TableCell className="px-6 py-4">Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.value ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"yield"}>
                  <TableCell className="px-6 py-4">Yield</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yield ? `${opportunity.yield}%` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"rent"}>
                  <TableCell className="px-6 py-4">Rent</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rent ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"gcaAboveGround"}>
                  <TableCell className="px-6 py-4">GCA Above Ground</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaAboveGround
                      ? `${opportunity.gcaAboveGround} m²`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"gcaBelowGround"}>
                  <TableCell className="px-6 py-4">GCA Below Ground</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaBelowGround
                      ? `${opportunity.gcaBelowGround} m²`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              Post-NDA Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {" "}
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"license"}>
                  <TableCell className="px-6 py-4">License</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.license ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"irr"}>
                  <TableCell className="px-6 py-4">IRR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.irr ? `${opportunity.irr}%` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"coc"}>
                  <TableCell className="px-6 py-4">COC</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coc ? `${opportunity.coc}%` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"licenseStage"}>
                  <TableCell className="px-6 py-4">License Stage</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.licenseStage ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"holdingPeriod"}>
                  <TableCell className="px-6 py-4">Holding Period</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.holdingPeriod
                      ? `${opportunity.holdingPeriod} years`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"breakEvenOccupancy"}>
                  <TableCell className="px-6 py-4">
                    Break Even Occupancy
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.breakEvenOccupancy ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"vacancyRate"}>
                  <TableCell className="px-6 py-4">Vacancy Rate</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.vacancyRate
                      ? `${opportunity.vacancyRate}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"estimatedRentValue"}>
                  <TableCell className="px-6 py-4">
                    Estimated Rent Value
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.estimatedRentValue ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"occupancyRate"}>
                  <TableCell className="px-6 py-4">Occupancy Rate</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyRate
                      ? `${opportunity.occupancyRate}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"moic"}>
                  <TableCell className="px-6 py-4">MOIC</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.moic ? `${opportunity.moic}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"price"}>
                  <TableCell className="px-6 py-4">Price</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.price ? `${opportunity.price}M€` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"totalInvestment"}>
                  <TableCell className="px-6 py-4">Total Investment</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.totalInvestment
                      ? `${opportunity.totalInvestment}M€`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"profitOnCost"}>
                  <TableCell className="px-6 py-4">Profit On Cost</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.profitOnCost
                      ? `${opportunity.profitOnCost}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"profit"}>
                  <TableCell className="px-6 py-4">Profit</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.profit ? `${opportunity.profit}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"sofCosts"}>
                  <TableCell className="px-6 py-4">SOF Costs</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sofCosts ? `${opportunity.sofCosts}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"sellPerSqm"}>
                  <TableCell className="px-6 py-4">Sell Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sellPerSqm
                      ? `${opportunity.sellPerSqm}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"gdv"}>
                  <TableCell className="px-6 py-4">GDV</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gdv ? `${opportunity.gdv}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"wault"}>
                  <TableCell className="px-6 py-4">WALT</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.walt ? `${opportunity.walt}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"debtServiceCoverageRatio"}>
                  <TableCell className="px-6 py-4">
                    Debt Service Coverage Ratio
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.debtServiceCoverageRatio
                      ? `${opportunity.debtServiceCoverageRatio}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"expectedExitYield"}>
                  <TableCell className="px-6 py-4">
                    Expected Exit Yield
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.expectedExitYield
                      ? `${opportunity.expectedExitYield}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"ltv"}>
                  <TableCell className="px-6 py-4">LTV</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ltv ? `${opportunity.ltv}%` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"ltc"}>
                  <TableCell className="px-6 py-4">LTC</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.ltc ? `${opportunity.ltc}%` : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"yieldOnCost"}>
                  <TableCell className="px-6 py-4">Yield On Cost</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yieldOnCost
                      ? `${opportunity.yieldOnCost}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between border-b">
            <CardTitle className="font-semibold text-xl">
              Co-Investment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Metric</TableHead>
                  <TableHead className="px-6 py-4">Value</TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    {" "}
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={"coInvestment"}>
                  <TableCell className="px-6 py-4">Co-Investment</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestment ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"gpEquityValue"}>
                  <TableCell className="px-6 py-4">GP Equity Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gpEquityValue
                      ? `${opportunity.gpEquityValue}M€`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"gpEquityPercentage"}>
                  <TableCell className="px-6 py-4">
                    GP Equity Percentage
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gpEquityPercentage
                      ? `${opportunity.gpEquityPercentage}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"totalEquityRequired"}>
                  <TableCell className="px-6 py-4">
                    Total Equity Required
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.totalEquityRequired
                      ? `${opportunity.totalEquityRequired}M€`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"sponsorPresentation"}>
                  <TableCell className="px-6 py-4">
                    Sponsor Presentation
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sponsorPresentation ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"promoteStructure"}>
                  <TableCell className="px-6 py-4">Promote Structure</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.promoteStructure ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"projectIRR"}>
                  <TableCell className="px-6 py-4">Project IRR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.projectIRR
                      ? `${opportunity.projectIRR}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"investorIRR"}>
                  <TableCell className="px-6 py-4">Investor IRR</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.investorIRR
                      ? `${opportunity.investorIRR}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"coInvestmentHoldPeriod"}>
                  <TableCell className="px-6 py-4">
                    Co-Investment Hold Period
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestmentHoldPeriod
                      ? `${opportunity.coInvestmentHoldPeriod} years`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
                <TableRow key={"coInvestmentBreakEvenOccupancy"}>
                  <TableCell className="px-6 py-4">
                    Co-Investment Break Even Occupancy
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.coInvestmentBreakEvenOccupancy
                      ? `${opportunity.coInvestmentBreakEvenOccupancy}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
};

export default Page;
