"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { Moon, Sun } from "lucide-react";
import { useGlobalStore } from "@/store/global";

const DarkModeSwitcher = () => {
  const { darkMode, toggleDarkMode } = useGlobalStore();
  return (
    <ActionButton
      icon={darkMode ? <Sun /> : <Moon />}
      onClick={toggleDarkMode}
      classList="rounded-full outline-transparent hover:outline-transparent hover:bg-accent/50 !w-10 !h-10"
    />
  );
};

export default DarkModeSwitcher;
