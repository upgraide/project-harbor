"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { signInPath } from "@/lib/paths";
import { useScopedI18n } from "@/locales/client";

export const Hero = () => {
  const t = useScopedI18n("ladingPage");
  return (
    <main className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white font-medium leading-[1.2] ">
              {t("title.firstRow")}
              <br />
              {t("title.secondRow")}
              <br />
              {t("title.thirdRow")}
            </h1>
          </div>

          <div className="text-left space-y-8">
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-md">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size={"lg"} variant={"default"}>
                {t("buttons.requestAccess")}
              </Button>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href={signInPath()}
              >
                <Lock className="size-4 mr-2" />
                {t("buttons.membershipLogin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
