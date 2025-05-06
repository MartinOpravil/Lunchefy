"use client";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { useTranslations } from "next-intl";
import LinkButton from "@/components/global/button/LinkButton";
import { ButtonVariant } from "@/enums";
import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";

const Header = () => {
  const t = useTranslations("Global.Button");
  const { user } = useUser();

  return (
    <nav className="page-width-normal flex justify-between items-center py-8">
      <Link href="/">
        <span className="logo text-[36px] sm:text-[40px]">Lunchefy</span>
      </Link>
      <div className="flex gap-4 justify-center items-center">
        <LocaleSwitcherSelect />
        <DarkModeSwitcher />
        <ClerkLoaded>
          <SignedOut>
            <LinkButton
              classList="!px-5 !py-3 uppercase"
              title={t("SignIn")}
              href="/app"
              variant={ButtonVariant.Positive}
            />
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonPopoverActionButton__manageAccount:
                    user?.publicMetadata?.preventEditProfile && "hidden",
                },
              }}
            />
          </SignedIn>
        </ClerkLoaded>
      </div>
    </nav>
  );
};

export default Header;
