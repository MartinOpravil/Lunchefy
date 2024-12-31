import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";
import React, { useState, useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useLocale } from "next-intl";
import { LoaderCircle } from "lucide-react";
import Flag from "react-world-flags";

const LocaleSwitcherSelect = () => {
  const [isPending, startTransition] = useTransition();
  const [language, setLanguage] = useState(useLocale());

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
      setLanguage(locale);
    });
  }

  const convertToFlagCode = (language: string) => {
    switch (language) {
      case "en":
        return "GBR";
      case "cs":
        return "CZ";
      default:
        return "CZ";
    }
  };

  return (
    <>
      <Select value={language} onValueChange={onChange}>
        <SelectTrigger
          useArrow={false}
          className="input-class !border-transparent relative flex gap-2"
        >
          {isPending && (
            <LoaderCircle className="animate-spin text-primary !w-6 !h-6" />
          )}
          <div className="overflow-hidden">
            <Flag
              code={convertToFlagCode(language)}
              className="w-8 scale-105"
            />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value={"cs"}>
            <div className="flex gap-2">Čeština</div>
          </SelectItem>
          <SelectItem value={"en"}>
            <div className="flex gap-2">English</div>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default LocaleSwitcherSelect;
