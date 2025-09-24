import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScopedI18n } from "@/locales/server";
import Header from "@/modules/dashboard/ui/components/header";
import MergersAndAcquisitionsView from "@/modules/dashboard/ui/views/mergers-and-acquisitions-view";

const Page = async () => {
  const t = await getScopedI18n("dashboard.header");

  return (
    <>
      <Header description={t("description")} title={t("title")} />
      <div className="flex h-full w-full bg-secondary px-6 py-8">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="flex w-full flex-col rounded-lg border border-border bg-card">
            <div className="relative mx-auto w-full p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mx-auto mb-8">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="mergersAndAcquisitions">
                    M&A Projects
                  </TabsTrigger>
                  <TabsTrigger value="realEstate">Real Estate</TabsTrigger>
                </TabsList>
                <TabsContent value="mergersAndAcquisitions">
                  <MergersAndAcquisitionsView />
                </TabsContent>
                <TabsContent value="realEstate">
                  <h1>Real Estate</h1>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
