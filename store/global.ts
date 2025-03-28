import { setDarkModeCookie } from "@/lib/cookies";
import { create } from "zustand";

type GlobalStore = {
  darkMode: boolean;
  setDarkMode: (value: boolean, withCookie?: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  darkMode: false,

  setDarkMode: (value: boolean, withCookie: boolean = true) => {
    set((state) => ({ darkMode: value }));
    if (withCookie) setDarkModeCookie(value);
  },
}));
