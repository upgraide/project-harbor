import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";

export const Header = () => (
  <header className="relative z-20 mx-auto flex items-center justify-between p-6">
    <Image
      alt="logo"
      className="hidden md:block"
      height={250}
      src="/assets/logo-light.png"
      width={250}
    />
    <Image
      alt="logo"
      className="block md:hidden"
      height={125}
      src="/assets/logo-light.png"
      width={125}
    />

    <LanguageSwitcher />
  </header>
);
