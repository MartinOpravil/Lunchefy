"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import LocaleSwitcherSelect from "../global/LocaleSwitcherSelect";
import ContinueButton from "../auth/ContinueButton";
import LoginButton from "../auth/LoginButton";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-8">
      <span className="logo text-[36px] sm:text-[40px]">Lunchefy</span>
      <div className="flex gap-4 justify-center items-center">
        <LocaleSwitcherSelect />
        <SignedOut>
          <ContinueButton classList="!px-5 !py-3" title="Sign in" />
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
          />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
