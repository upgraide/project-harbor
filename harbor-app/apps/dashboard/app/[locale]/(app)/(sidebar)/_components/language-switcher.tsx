"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@harbor-app/ui/components/select";
import { Languages } from "lucide-react";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const langs = [
    { text: "English", value: "en" },
    { text: "Portuguese", value: "pt" },
  ];
  const formatLanguage = (lng: string) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };

  return (
    <Select onValueChange={changeLocale} value={locale}>
      <SelectTrigger className="h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40">
        <div className="flex items-start gap-2">
          <Languages className="h-[14px] w-[14px]" />
          <span className="text-xs font-medium">{formatLanguage(locale)}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {langs.map(({ text, value }) => (
          <SelectItem
            className="text-sm font-medium text-primary/60"
            key={value}
            value={value}
          >
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
