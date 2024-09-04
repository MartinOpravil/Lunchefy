"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-start py-2">
      <Image src="/logo.svg" alt="logo" width={120} height={0} />
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
