"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { csCZ } from "@clerk/localizations";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    localization={csCZ}
    signInForceRedirectUrl="/app"
    signUpForceRedirectUrl="/app"
    appearance={{
      layout: {},
      variables: {
        colorBackground: "#fdf8ed",
        colorPrimary: "#f2726e",
        colorText: "#57463e",
        colorInputBackground: "#fdf8ed",
        colorInputText: "#424242",
      },
    }}
  >
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;
