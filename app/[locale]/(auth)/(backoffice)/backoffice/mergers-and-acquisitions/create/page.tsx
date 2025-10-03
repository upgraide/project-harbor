import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { backofficeMergersAndAcquisitionsPath } from "@/lib/paths";
import { getScopedI18n } from "@/locales/server";
import MergersAndAcquisitionsCreateForm from "@/modules/backoffice/ui/components/mergers-and-acquisitions-create-form";

const Page = async () => {
  const t = await getScopedI18n("backoffice.mergersAndAcquisitions.create");

  return (
    <SidebarInset>
      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b bg-background p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={backofficeMergersAndAcquisitionsPath()}>
                {t("breadcrumb.title")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("breadcrumb.create")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <MergersAndAcquisitionsCreateForm />
    </SidebarInset>
  );
};

export default Page;
