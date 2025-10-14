import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { indexPath } from "@/paths";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link className="flex items-center gap-2 self-center" href={indexPath()}>
        <DynamicImage
          alt="Harbor"
          darkSrc="/assets/logo-light.png"
          height={200}
          lightSrc="/assets/logo-dark.png"
          width={200}
        />
      </Link>
      {children}
    </div>
  </div>
);

export default Layout;
