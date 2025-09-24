import { DynamicImage } from "@/components/dynamic-image";
import { SidebarInset } from "@/components/ui/sidebar";
import DarkLogo from "@/public/assets/logo-dark.png";
import LightLogo from "@/public/assets/logo-light.png";

const MergersAndAcquisitionsView = () => {
  return (
    <SidebarInset className="bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <DynamicImage
          alt="Logo"
          darkSrc={LightLogo}
          height={250}
          lightSrc={DarkLogo}
          width={250}
        />
      </div>
    </SidebarInset>
  );
};

export default MergersAndAcquisitionsView;
