import { isEU } from "@harbor-app/location";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { getScopedI18n } from "@/locales/server";
import backgroundLight from "@/public/assets/bg-login.jpg";
import backgroundDark from "@/public/assets/bg-login-dark.jpg";
import DarkIcon from "@/public/icon-dark.png";
import LightIcon from "@/public/icon-light.png";
import { Cookies } from "@/utils/constants";
import { ConsentBanner } from "./_components/consent-banner";

export const metadata: Metadata = {
  title: "Login | Harbor Partners",
};

export default async function Page() {
  const cookieStore = await cookies();
  const t = await getScopedI18n("login");
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);

  return (
    <div className="h-screen p-2">
      {/* Header - Logo */}
      <header className="absolute top-0 left-0 z-30 w-full">
        <div className="p-6 md:p-8">
          <DynamicImage
            alt="Background"
            className="h-8 w-auto"
            darkSrc={DarkIcon}
            lightSrc={LightIcon}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Background Image Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <DynamicImage
            alt="Background"
            className="object-cover"
            darkSrc={backgroundDark}
            lightSrc={backgroundLight}
          />
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 relative">
          {/* Form Content */}
          <div className="relative z-10 flex h-full items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <h1 className="text-lg mb-4 font-serif">{t("title")}</h1>
                <p className="text-[#878787] text-sm mb-8">
                  {t("description")}
                </p>
              </div>

              {/* Sign In Options */}
              <div className="space-y-4">{/* Primary Sign In Option */}</div>

              {/* Terms and Privacy */}
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
      </div>

      {/* Consent Banner */}
      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}
