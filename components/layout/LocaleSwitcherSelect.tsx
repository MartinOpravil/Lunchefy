import { useState, useTransition } from "react";
import Flag from "react-world-flags";

import { useLocale } from "next-intl";

import { LoaderCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/lib/locale";

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
          className="input-class relative flex gap-2 rounded-full !border-transparent p-0 hover:opacity-70"
        >
          {isPending && (
            <LoaderCircle className="!h-6 !w-6 animate-spin text-primary" />
          )}
          <div className="overflow-hidden">
            <Flag
              code={convertToFlagCode(language)}
              className="w-8 scale-105"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
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
