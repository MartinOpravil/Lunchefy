import type { Metadata } from "next";
import { Inter, Playfair, Marck_Script } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";
import { Toaster } from "sonner";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

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
      icon: "/logo_mini.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn(
        playfair.variable,
        inter.variable,
        marckScript.variable,
        "overflow-x-hidden"
      )}
    >
      <body className="flex flex-col relative w-full bg-background">
        <NextIntlClientProvider messages={messages}>
          <ConvexClerkProvider>
            <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
          </ConvexClerkProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
