"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetRealEstateInterest,
  useMarkRealEstateInterest,
  useMarkRealEstateNoInterest,
  useSignRealEstateNDA,
} from "@/features/opportunities/hooks/use-real-estate-interest";
import { useSuspenseOpportunity } from "@/features/opportunities/hooks/use-real-estate-opportunities";
import { authClient } from "@/lib/auth-client";
import { getPusherClient } from "@/lib/pusher-client";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";
import { LocationMap } from "./location-map";

export const ViewerLoading = () => {
  const t = useScopedI18n("dashboard.realEstateViewer");
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-y-4 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <LoadingView message={t("loadingMessage")} />
    </div>
  );
};

export const ViewerError = () => {
  const t = useScopedI18n("dashboard.realEstateViewer");
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-y-4 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <ErrorView message={t("errorMessage")} />
    </div>
  );
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex component
export const Viewer = ({ opportunityId }: { opportunityId: string }) => {
  const t = useScopedI18n("dashboard.realEstateViewer");
  const locale = useCurrentLocale();
  const { data: opportunity } = useSuspenseOpportunity(opportunityId);
  const { data: preloadedInterest } = useGetRealEstateInterest(opportunityId);

  const [showNotInterestedDialog, setShowNotInterestedDialog] = useState(false);
  const [notInterestedReason, setNotInterestedReason] = useState("");
  const [userInterest, setUserInterest] = useState<{
    interested: boolean;
    ndaSigned: boolean;
  }>({
    interested: preloadedInterest?.interested ?? false,
    ndaSigned: preloadedInterest?.ndaSigned ?? false,
  });

  const handleMarkInterest = useMarkRealEstateInterest(() =>
    setUserInterest((prev) => ({ ...prev, interested: true }))
  );
  const handleMarkNoInterest = useMarkRealEstateNoInterest(() =>
    setUserInterest((prev) => ({ ...prev, interested: false }))
  );
  const handleSignNDA = useSignRealEstateNDA();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const invalidateInterestQueries = useCallback(() => {
    queryClient.invalidateQueries(
      trpc.realEstate.getOne.queryOptions({ id: opportunityId })
    );
    queryClient.invalidateQueries(
      trpc.userInterest.getRealEstateInterest.queryOptions({
        opportunityId,
      })
    );
  }, [queryClient, trpc, opportunityId]);

  // Subscribe to Pusher for real-time NDA status updates from webhook
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${email}`);

    channel.bind("nda-status-update", () => {
      invalidateInterestQueries();
    });

    return () => {
      channel.unbind("nda-status-update");
      pusher.unsubscribe(`user-${email}`);
    };
  }, [session?.user?.email, invalidateInterestQueries]);

  useEffect(() => {
    setUserInterest((prev) => ({
      ...prev,
      interested: preloadedInterest?.interested ?? false,
      ndaSigned: preloadedInterest?.ndaSigned ?? false,
    }));
  }, [preloadedInterest]);

  const getDisplayAsset = (value: string | null | undefined) => {
    if (!value) {
      return "N/A";
    }
    return t(`preNDACard.asset.values.${value}` as Parameters<typeof t>[0]);
  };

  const getDisplayInvestment = (value: string | null | undefined) => {
    if (!value) {
      return "N/A";
    }
    return t(
      `preNDACard.investment.values.${value}` as Parameters<typeof t>[0]
    );
  };

  const hasDescription = () => {
    const desc =
      locale === "en"
        ? opportunity.englishDescription
        : opportunity.description;
    return desc != null && desc !== "";
  };

  const hasPreNDAData = () =>
    opportunity.asset != null ||
    opportunity.nRoomsLastYear != null ||
    opportunity.noi != null ||
    opportunity.occupancyLastYear != null ||
    opportunity.walt != null ||
    opportunity.nBeds != null ||
    opportunity.investment != null ||
    opportunity.subRent != null ||
    opportunity.rentPerSqm != null ||
    opportunity.subYield != null ||
    opportunity.capex != null ||
    opportunity.capexPerSqm != null ||
    opportunity.sale != null ||
    opportunity.salePerSqm != null ||
    opportunity.location != null ||
    opportunity.area != null ||
    opportunity.value != null ||
    opportunity.yield != null ||
    opportunity.rent != null ||
    opportunity.gcaAboveGround != null ||
    opportunity.gcaBelowGround != null;

  const hasPostNDAData = () =>
    (opportunity.license != null && opportunity.license !== "") ||
    (opportunity.licenseStage != null && opportunity.licenseStage !== "") ||
    opportunity.irr != null ||
    opportunity.coc != null ||
    opportunity.holdingPeriod != null ||
    opportunity.breakEvenOccupancy != null ||
    opportunity.vacancyRate != null ||
    opportunity.estimatedRentValue != null ||
    opportunity.occupancyRate != null ||
    opportunity.moic != null ||
    opportunity.price != null ||
    opportunity.totalInvestment != null ||
    opportunity.profitOnCost != null ||
    opportunity.profit != null ||
    opportunity.sofCosts != null ||
    opportunity.sellPerSqm != null ||
    opportunity.gdv != null ||
    opportunity.wault != null ||
    opportunity.debtServiceCoverageRatio != null ||
    opportunity.expectedExitYield != null ||
    opportunity.ltv != null ||
    opportunity.ltc != null ||
    opportunity.yieldOnCost != null;

  const hasLimitedPartnerData = () => {
    if (opportunity.coInvestment === false) {
      return false;
    }
    return (
      opportunity.coInvestment != null ||
      opportunity.gpEquityValue != null ||
      opportunity.gpEquityPercentage != null ||
      opportunity.totalEquityRequired != null ||
      opportunity.projectIRR != null ||
      opportunity.investorIRR != null ||
      opportunity.coInvestmentHoldPeriod != null ||
      opportunity.coInvestmentBreakEvenOccupancy != null ||
      (opportunity.sponsorPresentation != null &&
        opportunity.sponsorPresentation !== "") ||
      (opportunity.promoteStructure != null &&
        opportunity.promoteStructure !== "")
    );
  };

  const hasImages = () =>
    opportunity.images != null && opportunity.images.length > 0;

  return (
    <main className="flex max-w-screen-xs flex-1 flex-col space-y-6 px-6 py-4 md:mx-auto md:max-w-screen-xl md:px-4">
      <h1 className="font-bold text-2xl md:text-4xl">{opportunity.name}</h1>

      {hasImages() && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardContent>
              {opportunity.images && opportunity.images.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {opportunity.images.length === 1 ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted md:aspect-video">
                      <Image
                        alt="Opportunity image"
                        className="object-cover"
                        fill
                        src={opportunity.images[0]}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted md:aspect-video">
                        <Image
                          alt="Opportunity image"
                          className="object-cover"
                          fill
                          src={opportunity.images[0]}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {opportunity.images.slice(1).map((imageUrl) => (
                          <div
                            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                            key={imageUrl}
                          >
                            <Image
                              alt="Opportunity image"
                              className="object-cover"
                              fill
                              src={imageUrl}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-muted-foreground/50 border-dashed py-12">
                  <p className="text-balance text-muted-foreground text-sm">
                    {t("imagesCard.noImages")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {hasDescription() && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("description")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasDescription() && (
                <p className="text-balance text-base">
                  {locale === "en"
                    ? opportunity.englishDescription
                    : opportunity.description}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {hasPreNDAData() && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("preNDACard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="px-6 py-4">
                      {t("preNDACard.table.header.metric")}
                    </TableHead>
                    <TableHead className="px-6 py-4">
                      {t("preNDACard.table.header.value")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunity.asset != null && (
                    <TableRow key="asset">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.asset.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {getDisplayAsset(opportunity.asset)}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.nRoomsLastYear != null && (
                    <TableRow key="nRoomsLastYear">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.nRoomsLastYear.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.nRoomsLastYear ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.noi != null && (
                    <TableRow key="noi">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.noi.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.noi.prefix") +
                          opportunity.noi +
                          t("preNDACard.noi.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.occupancyLastYear != null && (
                    <TableRow key="occupancyLastYear">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.occupancyLastYear.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.occupancyLastYear +
                          t("preNDACard.occupancyLastYear.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.walt != null && (
                    <TableRow key="walt">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.walt.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.walt + t("preNDACard.walt.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.nBeds != null && (
                    <TableRow key="nbeds">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.nBeds.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.nBeds ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.investment != null && (
                    <TableRow key="investment">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.investment.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {getDisplayInvestment(opportunity.investment)}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.subRent != null && (
                    <TableRow key="subRent">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.subRent.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.subRent.prefix") +
                          opportunity.subRent +
                          t("preNDACard.subRent.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.rentPerSqm != null && (
                    <TableRow key="rentPerSqm">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.rentPerSqm.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.rentPerSqm.prefix") +
                          opportunity.rentPerSqm +
                          t("preNDACard.rentPerSqm.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.subYield != null && (
                    <TableRow key="subYield">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.subYield.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.subYield + t("preNDACard.subYield.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.capex != null && (
                    <TableRow key="capex">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.capex.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.capex.prefix") +
                          opportunity.capex +
                          t("preNDACard.capex.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.capexPerSqm != null && (
                    <TableRow key="capexPerSqm">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.capexPerSqm.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.capexPerSqm.prefix") +
                          opportunity.capexPerSqm +
                          t("preNDACard.capexPerSqm.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.sale != null && (
                    <TableRow key="sale">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.sale.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.sale.prefix") +
                          opportunity.sale +
                          t("preNDACard.sale.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.salePerSqm != null && (
                    <TableRow key="salePerSqm">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.salePerSqm.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.salePerSqm.prefix") +
                          opportunity.salePerSqm +
                          t("preNDACard.salePerSqm.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.area != null && (
                    <TableRow key="area">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.area.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.area + t("preNDACard.area.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.value != null && (
                    <TableRow key="value">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.value.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.value.prefix") +
                          opportunity.value +
                          t("preNDACard.value.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.yield != null && (
                    <TableRow key="yield">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.yield.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.yield + t("preNDACard.yield.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.rent != null && (
                    <TableRow key="rent">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.rent.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.rent.prefix") +
                          opportunity.rent +
                          t("preNDACard.rent.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.gcaAboveGround != null && (
                    <TableRow key="gcaAboveGround">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.gcaAboveGround.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.gcaAboveGround +
                          t("preNDACard.gcaAboveGround.units")}
                      </TableCell>
                    </TableRow>
                  )}

                  {opportunity.gcaBelowGround != null && (
                    <TableRow key="gcaBelowGround">
                      <TableCell className="px-6 py-4">
                        {t("preNDACard.gcaBelowGround.label")}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {opportunity.gcaBelowGround +
                          t("preNDACard.gcaBelowGround.units")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {opportunity.location != null && opportunity.location !== "" && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("preNDACard.location.label")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocationMap location={opportunity.location} />
            </CardContent>
          </Card>
        </section>
      )}

      <section className="flex flex-wrap gap-4">
        <Button
          disabled={
            handleMarkInterest.isPending || userInterest?.interested === true
          }
          onClick={() => handleMarkInterest.mutate({ opportunityId })}
          type="button"
          variant={userInterest?.interested ? "default" : "secondary"}
        >
          {handleMarkInterest.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.interested ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : null}
          {userInterest?.interested
            ? t("buttons.markInterestedDone")
            : t("buttons.markInterested")}
        </Button>

        <Button
          disabled={
            handleMarkNoInterest.isPending || userInterest?.interested === false
          }
          onClick={() => setShowNotInterestedDialog(true)}
          type="button"
          variant={
            userInterest?.interested === false ? "destructive" : "secondary"
          }
        >
          {handleMarkNoInterest.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.interested === false ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : null}
          {userInterest?.interested === false
            ? t("buttons.notInterestedDone")
            : t("buttons.notInterested")}
        </Button>

        <Button
          disabled={handleSignNDA.isPending || userInterest?.ndaSigned === true}
          onClick={() => handleSignNDA.mutate({ opportunityId })}
          type="button"
          variant={userInterest?.ndaSigned ? "default" : "secondary"}
        >
          {handleSignNDA.isPending ? (
            <Spinner className="mr-2" />
          ) : userInterest?.ndaSigned ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : null}
          {userInterest?.ndaSigned
            ? t("buttons.signNDADone")
            : t("buttons.signNDA")}
        </Button>
      </section>

      {userInterest?.ndaSigned === true && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("postNDACard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="px-6 py-4">
                      {t("postNDACard.table.header.metric")}
                    </TableHead>
                    <TableHead className="px-6 py-4">
                      {t("postNDACard.table.header.value")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key="license">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.license.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.license || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="licenseStage">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.licenseStage.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.licenseStage || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="irr">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.irr.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.irr != null
                        ? opportunity.irr + t("postNDACard.irr.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="coc">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.coc.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coc != null
                        ? opportunity.coc + t("postNDACard.coc.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="holdingPeriod">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.holdingPeriod.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.holdingPeriod != null
                        ? opportunity.holdingPeriod +
                          t("postNDACard.holdingPeriod.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="breakEvenOccupancy">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.breakEvenOccupancy.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.breakEvenOccupancy != null
                        ? opportunity.breakEvenOccupancy +
                          t("postNDACard.breakEvenOccupancy.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="vacancyRate">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.vacancyRate.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.vacancyRate != null
                        ? opportunity.vacancyRate +
                          t("postNDACard.vacancyRate.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="estimatedRentValue">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.estimatedRentValue.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.estimatedRentValue != null
                        ? t("postNDACard.estimatedRentValue.prefix") +
                          opportunity.estimatedRentValue +
                          t("postNDACard.estimatedRentValue.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="occupancyRate">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.occupancyRate.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.occupancyRate != null
                        ? opportunity.occupancyRate +
                          t("postNDACard.occupancyRate.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="moic">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.moic.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.moic != null
                        ? opportunity.moic + t("postNDACard.moic.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="price">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.price.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.price != null
                        ? t("postNDACard.price.prefix") +
                          opportunity.price +
                          t("postNDACard.price.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="totalInvestment">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.totalInvestment.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.totalInvestment != null
                        ? t("postNDACard.totalInvestment.prefix") +
                          opportunity.totalInvestment +
                          t("postNDACard.totalInvestment.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="profitOnCost">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.profitOnCost.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.profitOnCost != null
                        ? opportunity.profitOnCost +
                          t("postNDACard.profitOnCost.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="profit">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.profit.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.profit != null
                        ? t("postNDACard.profit.prefix") +
                          opportunity.profit +
                          t("postNDACard.profit.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="sofCosts">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.sofCosts.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.sofCosts != null
                        ? t("postNDACard.sofCosts.prefix") +
                          opportunity.sofCosts +
                          t("postNDACard.sofCosts.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="sellPerSqm">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.sellPerSqm.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.sellPerSqm != null
                        ? t("postNDACard.sellPerSqm.prefix") +
                          opportunity.sellPerSqm +
                          t("postNDACard.sellPerSqm.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="gdv">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.gdv.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.gdv != null
                        ? t("postNDACard.gdv.prefix") +
                          opportunity.gdv +
                          t("postNDACard.gdv.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="wault">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.wault.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.wault != null
                        ? opportunity.wault + t("postNDACard.wault.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="debtServiceCoverageRatio">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.debtServiceCoverageRatio.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.debtServiceCoverageRatio != null
                        ? opportunity.debtServiceCoverageRatio +
                          t("postNDACard.debtServiceCoverageRatio.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="expectedExitYield">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.expectedExitYield.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.expectedExitYield != null
                        ? opportunity.expectedExitYield +
                          t("postNDACard.expectedExitYield.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="ltv">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.ltv.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.ltv != null
                        ? opportunity.ltv + t("postNDACard.ltv.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="ltc">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.ltc.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.ltc != null
                        ? opportunity.ltc + t("postNDACard.ltc.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="yieldOnCost">
                    <TableCell className="px-6 py-4">
                      {t("postNDACard.yieldOnCost.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.yieldOnCost != null
                        ? opportunity.yieldOnCost +
                          t("postNDACard.yieldOnCost.units")
                        : "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {userInterest?.ndaSigned === true && (
        <section>
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="font-bold text-lg">
                {t("limitedPartnerCard.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="px-6 py-4">
                      {t("limitedPartnerCard.table.header.metric")}
                    </TableHead>
                    <TableHead className="px-6 py-4">
                      {t("limitedPartnerCard.table.header.value")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key="gpEquityValue">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.gpEquityValue.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.gpEquityValue != null
                        ? t("limitedPartnerCard.gpEquityValue.prefix") +
                          opportunity.gpEquityValue +
                          t("limitedPartnerCard.gpEquityValue.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="gpEquityPercentage">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.gpEquityPercentage.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.gpEquityPercentage != null
                        ? opportunity.gpEquityPercentage +
                          t("limitedPartnerCard.gpEquityPercentage.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="totalEquityRequired">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.totalEquityRequired.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.totalEquityRequired != null
                        ? t("limitedPartnerCard.totalEquityRequired.prefix") +
                          opportunity.totalEquityRequired +
                          t("limitedPartnerCard.totalEquityRequired.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="projectIRR">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.projectIRR.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.projectIRR != null
                        ? opportunity.projectIRR +
                          t("limitedPartnerCard.projectIRR.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="investorIRR">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.investorIRR.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.investorIRR != null
                        ? opportunity.investorIRR +
                          t("limitedPartnerCard.investorIRR.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="coInvestmentHoldPeriod">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.coInvestmentHoldPeriod.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coInvestmentHoldPeriod != null
                        ? opportunity.coInvestmentHoldPeriod +
                          t("limitedPartnerCard.coInvestmentHoldPeriod.units")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="coInvestmentBreakEvenOccupancy">
                    <TableCell className="px-6 py-4">
                      {t(
                        "limitedPartnerCard.coInvestmentBreakEvenOccupancy.label"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.coInvestmentBreakEvenOccupancy != null
                        ? opportunity.coInvestmentBreakEvenOccupancy +
                          t(
                            "limitedPartnerCard.coInvestmentBreakEvenOccupancy.units"
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="sponsorPresentation">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.sponsorPresentation.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.sponsorPresentation || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow key="promoteStructure">
                    <TableCell className="px-6 py-4">
                      {t("limitedPartnerCard.promoteStructure.label")}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {opportunity.promoteStructure || "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      <AlertDialog
        onOpenChange={setShowNotInterestedDialog}
        open={showNotInterestedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("notInterestedDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("notInterestedDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            className="mt-4"
            onChange={(e) => setNotInterestedReason(e.target.value)}
            placeholder={t("notInterestedDialog.placeholder")}
            rows={4}
            value={notInterestedReason}
          />
          <div className="mt-4 flex justify-end gap-3">
            <AlertDialogCancel disabled={handleMarkNoInterest.isPending}>
              {t("notInterestedDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={handleMarkNoInterest.isPending}
              onClick={() => {
                handleMarkNoInterest.mutate({
                  opportunityId,
                  reason: notInterestedReason,
                });
                setShowNotInterestedDialog(false);
                setNotInterestedReason("");
              }}
            >
              {handleMarkNoInterest.isPending ? (
                <Spinner className="mr-2" />
              ) : null}
              {t("notInterestedDialog.confirm")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
