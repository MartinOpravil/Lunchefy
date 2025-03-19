"use client";
import Header from "@/components/header/Header";
import { isSavedThemeDarkMode } from "@/lib/theme";
import { useGlobalStore } from "@/store/global";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { toggleDarkMode } = useGlobalStore();

  useEffect(() => {
    if (isSavedThemeDarkMode()) toggleDarkMode();
  }, []);

  return (
    <>
      <Header />
      {children}
    </>
  );
}
