"use client";
import { notifySuccess } from "@/lib/notifications";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("loggedOut")) {
      notifySuccess("You have been logged out.");
      window.history.replaceState(null, "", "/sign-in");
    }
  }, [searchParams]);

  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignIn />
    </div>
  );
};

export default Page;
