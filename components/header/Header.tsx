"use client";
import { SignedOut, UserButton } from "@clerk/nextjs";
import React from "react";
import LocaleSwitcherSelect from "../global/LocaleSwitcherSelect";
import { useTranslations } from "next-intl";
import LinkButton from "../global/LinkButton";
import { ButtonVariant } from "@/enums";

const Header = () => {
  const t = useTranslations("Global.Button");

  return (
    <div className="flex justify-between items-center py-8">
      <span className="logo text-[36px] sm:text-[40px]">Lunchefy</span>
      <div className="flex gap-4 justify-center items-center">
        <LocaleSwitcherSelect />
        <SignedOut>
          <LinkButton
            classList="!px-5 !py-3 uppercase"
            title={t("SignIn")}
            href="/app"
            variant={ButtonVariant.Positive}
          />
        </SignedOut>
        <UserButton
          appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
        />
      </div>
    </div>
  );
};

export default Header;
