import { DynamicImage } from "@/components/dynamic-image";
import DarkLogo from "@/public/logo-dark.png";
import LightLogo from "@/public/logo-light.png";

export const MergersAndAcquisitionsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <DynamicImage
          alt="Logo"
          darkSrc={LightLogo}
          height={250}
          lightSrc={DarkLogo}
          width={250}
        />
      </div>
    </div>
  );
};
