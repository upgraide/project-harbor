import { DynamicImage } from "@/components/dynamic-image";
import { SidebarInset } from "@/components/ui/sidebar";

const MergersAndAcquisitionsView = () => (
  <SidebarInset className="bg-muted">
    <div className="flex flex-1 items-center justify-center gap-x-2">
      <DynamicImage
        alt="Logo"
        darkSrc="/assets/logo-light.png"
        height={250}
        lightSrc="/assets/logo-dark.png"
        width={250}
      />
    </div>
  </SidebarInset>
);

export default MergersAndAcquisitionsView;
