"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { csCZ, enUS } from "@clerk/localizations";
import { useLocale } from "next-intl";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    localization={useLocale() === "cs" ? csCZ : enUS}
    signInForceRedirectUrl="/app"
    signUpForceRedirectUrl="/app"
    afterSignOutUrl="/sign-in?loggedOut=true"
    appearance={{
      layout: {},
      variables: {
        colorBackground: "#ffffff",
        colorPrimary: "#ff622c",
        colorText: "#000000",
        colorInputBackground: "#ffffff",
        colorInputText: "#000000",
      },
    }}
  >
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;
