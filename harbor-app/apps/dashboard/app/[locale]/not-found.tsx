import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { getScopedI18n } from "@/locales/server";
import DarkIcon from "@/public/icon-dark.png";
import LightIcon from "@/public/icon-light.png";

export default async function NotFound() {
  const t = await getScopedI18n("not-found");

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
      <DynamicImage
        alt="Harbor"
        className="mb-10"
        darkSrc={DarkIcon}
        lightSrc={LightIcon}
      />
      <h2 className="text-xl font-semibold mb-2">{t("title")}</h2>
      <p className="mb-4">{t("description")}</p>
      <Link className="underline" href="/">
        {t("returnHome")}
      </Link>
    </div>
  );
}
