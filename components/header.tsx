import logoLight from "@/public/assets/logo-light.png";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="relative z-20 flex items-center justify-start p-6">
      <Image alt="logo" src={logoLight} height={250} width={250} />
    </header>
  );
};
