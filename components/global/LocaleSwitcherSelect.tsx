import { Locale } from "@/i18n/config";
import { setUserLocale, getUserLocale } from "@/lib/locale";
import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLocale } from "next-intl";

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

  return (
    <Select value={language} onValueChange={onChange}>
      {isPending && <div>Applying..</div>}
      <SelectTrigger className="input-class h-full border-2 border-accent focus-visible:ring-secondary transition-all">
        <SelectValue
          className="placehold:text-secondary"
          placeholder="Select a privilage"
        />
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
  );
};

export default LocaleSwitcherSelect;
