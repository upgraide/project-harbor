"use client";

import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "@/locales/client";

export function LanguageSwitcher() {
  const t = useScopedI18n("languageSwitcher");
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const langs = [
    { text: t("english"), value: "en" },
    { text: t("portuguese"), value: "pt" },
  ];
  const formatLanguage = (lng: string) =>
    langs.find((lang) => lang.value === lng)?.text;

  return (
    <Select onValueChange={changeLocale} value={locale}>
      <SelectTrigger
        className="!px-2 h-6 rounded border-primary/20 hover:border-primary/40"
        size="sm"
      >
        <div className="flex items-start gap-2">
          <Languages className="h-[14px] w-[14px]" />
          <span className="font-medium text-xs">{formatLanguage(locale)}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {langs.map(({ text, value }) => (
          <SelectItem
            className="font-medium text-primary/60 text-sm"
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
