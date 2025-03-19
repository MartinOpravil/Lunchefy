import { setDarkMode } from "@/lib/theme";
import { create } from "zustand";

type GlobalStore = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  darkMode: false,

  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
    setDarkMode(get().darkMode);
  },
}));
