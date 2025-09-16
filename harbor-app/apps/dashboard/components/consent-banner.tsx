"use client";

import { Button } from "@harbor-app/ui/components/button";
import { cn } from "@harbor-app/ui/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { trackingConsentAction } from "@/actions/tracking-consent-action";
import { useScopedI18n } from "@/locales/client";

export function ConsentBanner() {
  const t = useScopedI18n("consentBanner");
  const [isOpen, setOpen] = useState(true);
  const trackingAction = useAction(trackingConsentAction, {
    onExecute: () => setOpen(false),
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-50 bottom-2 md:bottom-4 left-2 md:left-4 flex flex-col space-y-4 w-[calc(100vw-16px)] max-w-[420px] border border-border p-4 transition-all bg-background",
        isOpen &&
          "animate-in sm:slide-in-from-bottom-full slide-in-from-bottom-full",
      )}
    >
      <div className="text-sm">{t("description")}</div>
      <div className="flex justify-end space-x-2">
        <Button
          className="rounded-full h-8"
          onClick={() => trackingAction.execute(false)}
        >
          {t("deny")}
        </Button>
        <Button
          className="rounded-full h-8"
          onClick={() => trackingAction.execute(true)}
        >
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}
