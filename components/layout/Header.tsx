"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import LinkButton from "@/components/global/button/LinkButton";
import DarkModeSwitcher from "@/components/layout/DarkModeSwitcher";
import LocaleSwitcherSelect from "@/components/layout/LocaleSwitcherSelect";

import { ButtonVariant } from "@/enums";

const Header = () => {
  const t = useTranslations("Global.Button");
  const { user } = useUser();

  return (
    <nav className="page-width-normal flex items-center justify-between py-8">
      <Link href="/">
        <span className="logo text-[36px] sm:text-[40px]">Lunchefy</span>
      </Link>
      <div className="flex items-center justify-center gap-4">
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
