import { Plus } from "lucide-react";
import { getScopedI18n } from "@/locales/server";
import DashboardView from "@/modules/dashboard/ui/view/dashboard-view";
import { Header } from "./_components/header";

export default async function Page() {
  const t = await getScopedI18n("dashboard");
  return (
    <>
      <Header description={t("description")} title={t("title")} />
      <div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-black">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black">
            <div className="flex w-full flex-col rounded-lg p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-medium text-primary">
                  {t("bodyTitle")}
                </h2>
                <p className="text-sm font-normal text-primary/60">
                  {t("bodyDescription")}
                </p>
              </div>
            </div>
            <div className="flex w-full px-6">
              <div className="w-full border-b border-border" />
            </div>
            <DashboardView />
          </div>
        </div>
      </div>
    </>
  );
}
