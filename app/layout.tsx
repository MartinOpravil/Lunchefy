import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Inter, Marck_Script, Playfair } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { Toaster } from "sonner";

import ConvexClerkProvider from "@/app/providers/ConvexClerkProvider";
import ThemeProvider from "@/app/providers/ThemeProvider";

import { getDarkModeCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

import "./globals.css";

const playfair = Playfair({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-inter",
});
const marckScript = Marck_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marck",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.Metadata");
  return {
    title: "Lunchefy",
    description: t("Description"),
    icons: {
      icon: "https://lunchefy.vercel.app/logo_mini.ico",
    },
    openGraph: {
      title: "Lunchefy",
      description: t("Description"),
      url: "https://lunchefy.vercel.app",
      siteName: "Lunchefy",
      images: [
        {
          url: "https://lunchefy.vercel.app/logo.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "cs_CZ",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages, darkMode] = await Promise.all([
    getLocale(),
    getMessages(),
    getDarkModeCookie(),
  ]);

  return (
    <html
      lang={locale}
      className={cn(
        playfair.variable,
        inter.variable,
        marckScript.variable,
        "overflow-x-hidden",
        { "dark-theme": darkMode },
      )}
    >
      <body className="relative flex w-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <ConvexClerkProvider>
            <ConvexQueryCacheProvider>
              <ThemeProvider hasDarkMode={darkMode}>{children}</ThemeProvider>
            </ConvexQueryCacheProvider>
          </ConvexClerkProvider>
          <Toaster />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
