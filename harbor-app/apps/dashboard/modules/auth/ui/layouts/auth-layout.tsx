import { isEU } from "@harbor-app/location";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ConsentBanner } from "@/components/consent-banner";
import { DynamicImage } from "@/components/dynamic-image";
import { getScopedI18n } from "@/locales/server";
import DarkIcon from "@/public/icon-dark.png";
import LightIcon from "@/public/icon-light.png";
import LogoLight from "@/public/logo-light.png";
import LogoDark from "@/public/logo-dark.png";
import { Cookies } from "@/utils/constants";

export const metadata: Metadata = {
  title: "Login | Harbor Partners",
};

export const AuthLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const t = await getScopedI18n("login");
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);

  return (
    <div className="h-screen p-2">
      <header className="absolute top-0 left-0 z-30 w-full">
        <div className="p-6 md:p-8">
          <DynamicImage
            alt="Background"
            className="h-8 w-auto"
            darkSrc={LightIcon}
            lightSrc={DarkIcon}
          />
        </div>
      </header>

      <div className="w-full h-full relative items-center justify-center">
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mb-6">
                <DynamicImage
                  alt="Background"
                  className="h-16 w-auto object-contain mx-auto"
                  darkSrc={LogoLight}
                  lightSrc={LogoDark}
                />
              </div>
              <h1 className="text-lg mb-4 font-serif">{t("title")}</h1>
              <p className="text-[#878787] text-sm mb-8">
                {t("description")}
              </p>
            </div>

            <div className="space-y-4">{children}</div>

            <div className="text-center absolute bottom-4 left-0 right-0">
              <p className="text-xs text-[#878787] leading-relaxed font-mono">
                {t("footer")}{" "}
                <Link className="underline" href="">
                  {" "}
                  {/*TODO: Change to the correct URL*/}
                  {t("termsOfService")}
                </Link>{" "}
                &{" "}
                <Link className="underline" href="">
                  {" "}
                  {/*TODO: Change to the correct URL*/}
                  {t("privacyPolicy")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
};
