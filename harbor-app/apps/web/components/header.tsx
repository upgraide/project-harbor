import logoDark from "@/public/brand/logo-dark.png";
import logoLight from "@/public/brand/logo-light.png";
import { DynamicImage } from "./dynamic-image";

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-start p-6">
      <DynamicImage
        alt="logo"
        darkSrc={logoDark}
        height={250}
        lightSrc={logoLight}
        width={250}
      />
    </header>
  );
}
