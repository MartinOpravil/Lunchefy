"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { SignIn } from "@clerk/nextjs";

import { notifySuccess } from "@/lib/notifications";

const Page = () => {
  const t = useTranslations("Users.Notification.Success");
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("loggedOut")) {
      notifySuccess(t("Logout"));
      window.history.replaceState(null, "", "/sign-in");
    }
  }, [searchParams, t]);

  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignIn />
      {/* <SignedOut>
      </SignedOut> */}
    </div>
  );
};

export default Page;
