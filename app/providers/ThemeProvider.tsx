"use client";
import { useGlobalStore } from "@/store/global";
import React, { useEffect } from "react";

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
      // console.log("Setting dark mode to:", hasDarkMode);
      setDarkMode(hasDarkMode, false);
    }
  }, []);

  return children;
};

export default ThemeProvider;
