import {
  BellIcon,
  BriefcaseBusinessIcon,
  ChartBarIcon,
  ClipboardCheckIcon,
  HeartIcon,
  HomeIcon,
  UserPlusIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/locales/server";
import {
  backofficeAccessRequestsPath,
  backofficeAnalyticsPath,
  backofficeCloseOpportunitiesPath,
  backofficeInvestmentInterestsPath,
  backofficeInvestorsPath,
  backofficeMergeAndAcquisitionPath,
  backofficeNotificationsPath,
  backofficeRealEstatePath,
  backofficeUsersPath,
} from "@/paths";

const Page = async () => {
  const t = await getScopedI18n("backoffice.main");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backoffice</h1>
        <p className="text-muted-foreground">
          Welcome to the backoffice management area
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Close Opportunities */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheckIcon className="size-5" />
              {t("closeOpportunities.title")}
            </CardTitle>
            <CardDescription>
              {t("closeOpportunities.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeCloseOpportunitiesPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mergers and Acquisitions */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusinessIcon className="size-5" />
              {t("mergersAndAcquisitions.title")}
            </CardTitle>
            <CardDescription>
              {t("mergersAndAcquisitions.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeMergeAndAcquisitionPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Real Estate */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HomeIcon className="size-5" />
              {t("realEstate.title")}
            </CardTitle>
            <CardDescription>{t("realEstate.description")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeRealEstatePath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-5" />
              {t("users.title")}
            </CardTitle>
            <CardDescription>{t("users.description")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeUsersPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Investors */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="size-5" />
              {t("investors.title")}
            </CardTitle>
            <CardDescription>{t("investors.description")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeInvestorsPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="size-5" />
              {t("analytics.title")}
            </CardTitle>
            <CardDescription>{t("analytics.description")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeAnalyticsPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Investment Interests */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartIcon className="size-5" />
              {t("investmentInterests.title")}
            </CardTitle>
            <CardDescription>
              {t("investmentInterests.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeInvestmentInterestsPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="size-5" />
              {t("notifications.title")}
            </CardTitle>
            <CardDescription>{t("notifications.description")}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeNotificationsPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Access Requests */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlusIcon className="size-5" />
              {t("accessRequests.title")}
            </CardTitle>
            <CardDescription>
              {t("accessRequests.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={backofficeAccessRequestsPath()}>
              <Button className="w-full">{t("accessButton")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
