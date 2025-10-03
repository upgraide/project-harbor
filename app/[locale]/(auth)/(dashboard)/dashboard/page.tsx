import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScopedI18n } from "@/locales/server";
import AllOpportunitiesView from "@/modules/dashboard/ui/views/all-opportunities-view";
import MergersAndAcquisitionsView from "@/modules/dashboard/ui/views/mergers-and-acquisitions-view";
import RealEstateView from "@/modules/dashboard/ui/views/real-estate-view";

const Page = async () => {
  const t = await getScopedI18n("dashboard");

  return (
    <Tabs className="w-full" defaultValue="all">
      <div className="min-h-[calc(100vh-80px)] bg-accent pb-12">
        <header className="z-10 flex w-full flex-col border-border border-b bg-card px-6">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start justify-between py-8">
            <div className="flex flex-col items-start gap-2">
              <h1 className="font-semibold text-3xl">{t("header.title")}</h1>
              <p className="font-normal text-base">{t("header.description")}</p>
            </div>
            <TabsList className="mt-6 mb-8 grid grid-cols-3">
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
              <TabsTrigger value="mergersAndAcquisitions">
                {t("tabs.mergersAndAcquisitions")}
              </TabsTrigger>
              <TabsTrigger value="realEstate">
                {t("tabs.realEstate")}
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <div className="flex h-full w-full bg-accent px-6 py-8">
          <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
            <div className="flex w-full flex-col rounded-lg border border-border bg-card">
              <div className="relative mx-auto w-full p-6">
                <TabsContent value="all">
                  <AllOpportunitiesView />
                </TabsContent>
                <TabsContent value="mergersAndAcquisitions">
                  <MergersAndAcquisitionsView />
                </TabsContent>
                <TabsContent value="realEstate">
                  <RealEstateView />
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

export default Page;
