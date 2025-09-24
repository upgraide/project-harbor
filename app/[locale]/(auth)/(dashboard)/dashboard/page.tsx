import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScopedI18n } from "@/locales/server";
import AllOpportunitiesView from "@/modules/dashboard/ui/views/all-opportunities-view";
import MergersAndAcquisitionsView from "@/modules/dashboard/ui/views/mergers-and-acquisitions-view";

const Page = async () => {
  const t = await getScopedI18n("dashboard.header");

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="bg-secondary min-h-[calc(100vh-80px)] pb-12">
        <header className="z-10 flex w-full flex-col border-b border-border bg-card px-6">
          <div className="mx-auto flex flex-col w-full max-w-screen-xl items-start justify-between py-8">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-medium text-primary/80">
                {t("title")}
              </h1>
              <p className="text-base font-normal text-primary/60">
                {t("description")}
              </p>
            </div>
            <TabsList className="grid grid-cols-3 mb-8 mt-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mergersAndAcquisitions">
                M&A Projects
              </TabsTrigger>
              <TabsTrigger value="realEstate">Real Estate</TabsTrigger>
            </TabsList>
          </div>
        </header>
        <div className="flex h-full w-full bg-secondary px-6 py-8">
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
                  <h1>Real Estate</h1>
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
