"use client";
import { notifySuccess } from "@/lib/notifications";
import { SignedOut, SignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

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
