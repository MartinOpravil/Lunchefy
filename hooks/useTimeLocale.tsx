import { useLocale } from "next-intl";

// TODO: Refactor i18n to use only one type of locale across app
export function useTimeLocale() {
  return useLocale() === "cs" ? "cs" : "en-GB";
}
