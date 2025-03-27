import { setDarkModeCookie } from "@/lib/cookies";
import { create } from "zustand";

type GlobalStore = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  darkMode: false,

  setDarkMode: (value: boolean) => {
    set((state) => ({ darkMode: value }));
    setDarkModeCookie(value);
  },
}));
