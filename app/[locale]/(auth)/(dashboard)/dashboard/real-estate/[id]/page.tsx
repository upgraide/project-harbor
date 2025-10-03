/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: Rewriting the page to use the new components */
/** biome-ignore-all lint/style/noMagicNumbers: Rewriting the page to use the new components */
"use client";

import { useQuery } from "convex/react";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";
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
    <div className="mx-auto mt-6 mb-6 w-full space-y-6 md:max-w-screen-lg">
      <h1 className="mt-6 font-bold text-2xl md:text-4xl">
        {opportunity.name}
      </h1>

      {opportunity.imagesUrls && opportunity.imagesUrls.length > 0 && (
        <>
          <div className="w-full">
            <Image
              alt="Opportunity Image 1"
              className="h-96 w-full rounded-lg object-cover"
              height={4501}
              src={opportunity.imagesUrls[0] ?? ""}
              width={4501}
            />
          </div>

          {opportunity.imagesUrls.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {opportunity.imagesUrls.slice(1, 4).map((imageUrl, index) => (
                <div key={index + 1}>
                  <Image
                    alt={`Opportunity Image ${index + 2}`}
                    className="h-48 w-full rounded-lg object-cover"
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

      <Card>
        <CardHeader className="flex items-center justify-between border-b">
          <CardTitle className="font-semibold text-xl">Description</CardTitle>
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
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">Metric</TableHead>
                <TableHead className="px-6 py-4">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunity.asset ? (
                <TableRow key={"asset"}>
                  <TableCell className="px-6 py-4">Asset</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.asset}
                  </TableCell>
                  <TableCell className="text-right" />
                </TableRow>
              ) : null}
              {opportunity.nRoomsLastYear ? (
                <TableRow key={"nRoomsLastYear"}>
                  <TableCell className="px-6 py-4">
                    Number of Rooms Last Year
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nRoomsLastYear}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.noi ? (
                <TableRow key={"noi"}>
                  <TableCell className="px-6 py-4">NOI</TableCell>
                  <TableCell className="px-6 py-4">{opportunity.noi}</TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.occupancyLastYear ? (
                <TableRow key={"occupancyLastYear"}>
                  <TableCell className="px-6 py-4">
                    Occupancy Last Year
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.occupancyLastYear}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.walt ? (
                <TableRow key={"walt"}>
                  <TableCell className="px-6 py-4">WALT</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.walt}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.nBeds ? (
                <TableRow key={"nBeds"}>
                  <TableCell className="px-6 py-4">Number of Beds</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.nBeds}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.investment ? (
                <TableRow key={"investment"}>
                  <TableCell className="px-6 py-4">Investment</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.investment}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.subRent ? (
                <TableRow key={"subRent"}>
                  <TableCell className="px-6 py-4">Sub Rent</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subRent}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.rentPerSqm ? (
                <TableRow key={"rentPerSqm"}>
                  <TableCell className="px-6 py-4">Rent Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rentPerSqm}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right" />
                </TableRow>
              ) : null}
              {opportunity.subYield ? (
                <TableRow key={"subYield"}>
                  <TableCell className="px-6 py-4">Sub Yield</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.subYield} %
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.capex ? (
                <TableRow key={"capex"}>
                  <TableCell className="px-6 py-4">Capex</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capex}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.capexPerSqm ? (
                <TableRow key={"capexPerSqm"}>
                  <TableCell className="px-6 py-4">Capex Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.capexPerSqm}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.sale ? (
                <TableRow key={"sale"}>
                  <TableCell className="px-6 py-4">Sale</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.sale}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.salePerSqm ? (
                <TableRow key={"salePerSqm"}>
                  <TableCell className="px-6 py-4">Sale Per Sqm</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.salePerSqm}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.location ? (
                <TableRow key={"location"}>
                  <TableCell className="px-6 py-4">Location</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.location}
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.area ? (
                <TableRow key={"area"}>
                  <TableCell className="px-6 py-4">Area</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.area} m²
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.value ? (
                <TableRow key={"value"}>
                  <TableCell className="px-6 py-4">Value</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.value} M€
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.yield ? (
                <TableRow key={"yield"}>
                  <TableCell className="px-6 py-4">Yield</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.yield} %
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.rent ? (
                <TableRow key={"rent"}>
                  <TableCell className="px-6 py-4">Rent</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.rent} M€/year
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.gcaAboveGround ? (
                <TableRow key={"gcaAboveGround"}>
                  <TableCell className="px-6 py-4">GCA Above Ground</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaAboveGround} m²
                  </TableCell>
                </TableRow>
              ) : null}
              {opportunity.gcaBelowGround ? (
                <TableRow key={"gcaBelowGround"}>
                  <TableCell className="px-6 py-4">GCA Below Ground</TableCell>
                  <TableCell className="px-6 py-4">
                    {opportunity.gcaBelowGround} m²
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex w-full items-center gap-4">
        <Button size={"lg"}>Interest to Invest</Button>
        {opportunity.coInvestment === true ? (
          <Button size={"lg"} variant={"outline"}>
            Co-Invest
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
