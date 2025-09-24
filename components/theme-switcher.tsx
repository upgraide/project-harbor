"use client";

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
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher({ triggerClass }: { triggerClass?: string }) {
  const { theme: currentTheme, setTheme, themes } = useTheme();
  return (
    <Select
      onValueChange={(theme) => setTheme(theme as (typeof themes)[number])}
      value={currentTheme}
    >
      <SelectTrigger
        className={cn(
          "h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40",
          triggerClass,
        )}
        size="sm"
      >
        <div className="flex items-start gap-2">
          {currentTheme === "light" ? (
            <Sun className="h-[14px] w-[14px]" />
          ) : currentTheme === "dark" ? (
            <Moon className="h-[14px] w-[14px]" />
          ) : (
            <Monitor className="h-[14px] w-[14px]" />
          )}
          {currentTheme && (
            <span className="text-xs font-medium">
              {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
            </span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem
            className={`text-sm font-medium text-primary/60 ${theme === currentTheme && "text-primary"}`}
            key={theme}
            value={theme}
          >
            {theme && theme.charAt(0).toUpperCase() + theme.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ThemeSwitcherHome() {
  const t = useScopedI18n("themeSwitcher");
  const { setTheme, themes } = useTheme();
  return (
    <div className="flex gap-3">
      {themes.map((theme) => (
        <button
          key={theme}
          name="theme"
          onClick={() => setTheme(theme)}
          type="button"
        >
          {theme === "light" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Sun className="h-4 w-4 text-primary/80 hover:text-primary" />
              </TooltipTrigger>
              <TooltipContent>{t("light")}</TooltipContent>
            </Tooltip>
          ) : theme === "dark" ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Moon className="h-4 w-4 text-primary/80 hover:text-primary" />
              </TooltipTrigger>
              <TooltipContent>{t("dark")}</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Monitor className="h-4 w-4 text-primary/80 hover:text-primary" />
              </TooltipTrigger>
              <TooltipContent>{t("system")}</TooltipContent>
            </Tooltip>
          )}
        </button>
      ))}
    </div>
  );
}
