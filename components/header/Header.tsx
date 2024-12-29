"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React from "react";
import LocaleSwitcherSelect from "../global/LocaleSwitcherSelect";
import ContinueButton from "../auth/ContinueButton";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Global.Button");

  return (
    <div className="flex justify-between items-center py-8">
      <span className="logo text-[36px] sm:text-[40px]">Lunchefy</span>
      <div className="flex gap-4 justify-center items-center">
        <LocaleSwitcherSelect />
        <SignedOut>
          <ContinueButton classList="!px-5 !py-3" title={t("SignIn")} />
        </SignedOut>
        <UserButton
          appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
        />
      </div>
    </div>
  );
};

export default Header;
