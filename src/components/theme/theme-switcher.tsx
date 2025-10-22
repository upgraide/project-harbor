"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

export function ThemeSwitcher({ triggerClass }: { triggerClass?: string }) {
  const t = useScopedI18n("themeSwitcher");
  const { theme: currentTheme, setTheme, themes } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Select
      onValueChange={(theme) => setTheme(theme as (typeof themes)[number])}
      value={currentTheme}
    >
      <SelectTrigger
        className={cn(
          "!px-2 h-6 rounded border-primary/20 hover:border-primary/40",
          triggerClass
        )}
        size="sm"
      >
        <div className="flex items-start gap-2">
          {(() => {
            if (currentTheme === "light") {
              return <Sun className="h-[14px] w-[14px]" />;
            }
            if (currentTheme === "dark") {
              return <Moon className="h-[14px] w-[14px]" />;
            }
            return <Monitor className="h-[14px] w-[14px]" />;
          })()}
          {currentTheme &&
            (currentTheme === "light" ||
              currentTheme === "dark" ||
              currentTheme === "system") && (
              <span className="font-medium text-xs">{t(currentTheme)}</span>
            )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem
            className={`font-medium text-sm ${theme === currentTheme && "text-primary"}`}
            key={theme}
            value={theme}
          >
            {(theme === "light" || theme === "dark" || theme === "system") &&
              t(theme)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeSwitcherHome() {
  const t = useScopedI18n("themeSwitcher");
  const { setTheme, themes } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderThemeIcon = (theme: string) => {
    if (theme === "light") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Sun className="h-4 w-4 hover:text-primary" />
          </TooltipTrigger>
          <TooltipContent>{t("light")}</TooltipContent>
        </Tooltip>
      );
    }
    if (theme === "dark") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Moon className="h-4 w-4 hover:text-primary" />
          </TooltipTrigger>
          <TooltipContent>{t("dark")}</TooltipContent>
        </Tooltip>
      );
    }
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Monitor className="h-4 w-4 hover:text-primary" />
        </TooltipTrigger>
        <TooltipContent>{t("system")}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex gap-3">
      {themes.map((theme) => (
        <button
          key={theme}
          name="theme"
          onClick={() => setTheme(theme)}
          type="button"
        >
          {renderThemeIcon(theme)}
        </button>
      ))}
    </div>
  );
}
