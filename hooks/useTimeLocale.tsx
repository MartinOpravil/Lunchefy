import { useLocale } from "next-intl";

import { TimeLocale } from "@/types";

// TODO: Refactor i18n to use only one type of locale across app
export function useTimeLocale(): TimeLocale {
  return useLocale() === "cs" ? "cs" : "en-GB";
}
