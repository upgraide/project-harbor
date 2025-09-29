import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";

export const Header = () => {
  return (
    <header className="relative z-20 flex items-center justify-between p-6 mx-auto">
      <Image
        alt="logo"
        src="/assets/logo-light.png"
        height={250}
        width={250}
        className="hidden md:block"
      />
      <Image
        alt="logo"
        src="/assets/logo-light.png"
        height={125}
        width={125}
        className="block md:hidden"
      />

      <LanguageSwitcher />
    </header>
  );
};
