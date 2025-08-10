"use client";

import { useEffect } from "react";

import { useGlobalStore } from "@/store/global";

interface ThemeProviderProps {
  children: React.ReactNode;
  hasDarkMode: boolean;
}

const ThemeProvider = ({
  children,
  hasDarkMode = false,
}: ThemeProviderProps) => {
  const { setDarkMode } = useGlobalStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDarkMode(hasDarkMode, false);
    }
  }, [hasDarkMode, setDarkMode]);

  return children;
};

export default ThemeProvider;
