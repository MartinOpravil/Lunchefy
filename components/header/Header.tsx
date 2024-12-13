"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import LocaleSwitcherSelect from "../global/LocaleSwitcherSelect";

const Header = () => {
  return (
    <div className="flex justify-between items-start py-8">
      <Image src="/logo.svg" alt="logo" width={160} height={0} />
      <div className="flex gap-4 justify-center items-center">
        <LocaleSwitcherSelect />
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
