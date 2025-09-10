"use client";

import { Button } from "@harbor-app/ui/components/button";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useScopedI18n("error");

  return (
    <div className="h-[calc(100vh-200px)] w-full">
      <div className="mt-8 flex flex-col items-center justify-center h-full">
        <div className="flex justify-between items-center flex-col mt-8 text-center mb-8">
          <h2 className="font-medium mb-4">{t("title")}</h2>
          <p className="text-sm text-[#878787]">{t("description")}</p>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => reset()} variant="outline">
            {t("tryAgain")}
          </Button>

          <Link href="/">
            {/*TODO: Change to the correct URL*/}
            <Button>{t("contactUs")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
