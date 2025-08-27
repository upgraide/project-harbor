import Image from "next/image";

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-start p-6">
      <Image src="/brand/logo-light.png" alt="logo" width={250} height={250} />
    </header>
  );
}
