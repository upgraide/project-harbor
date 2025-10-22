import { Lock, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getScopedI18n } from "@/locales/server";
import { loginPath, requestAccessPath } from "@/paths";

const Hero = async () => {
  const t = await getScopedI18n("index");
  return (
    <main className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="text-center md:text-left">
            <h1 className="font-medium text-4xl text-white uppercase leading-[1.2] lg:text-5xl xl:text-6xl">
              {t("title.firstRow")}
              <br />
              {t("title.secondRow")}
              <br />
              {t("title.thirdRow")}
            </h1>
          </div>

          <div className="space-y-8 text-left">
            <p className="max-w-md font-light text-white/80 text-xl leading-relaxed md:text-2xl">
              {t("description")}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className={buttonVariants({ variant: "secondary", size: "lg" })}
                href={requestAccessPath()}
              >
                <Plus className="mr-2 size-4" />
                {t("buttons.requestAccess")}
              </Link>
              <Link
                className={buttonVariants({ variant: "default", size: "lg" })}
                href={loginPath()}
              >
                <Lock className="mr-2 size-4" />
                {t("buttons.membershipLogin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export { Hero };
