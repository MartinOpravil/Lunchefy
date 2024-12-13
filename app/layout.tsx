import type { Metadata } from "next";
import { Inter, Playfair } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "./providers/ConvexClerkProvider";
import { Toaster } from "sonner";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cn } from "@/lib/utils";

const playfair = Playfair({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lunchefy",
  description: "Your ultimate recipe manager and dish decider.",
  icons: {
    icon: "/logo_mini.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn(playfair.variable, inter.variable)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ConvexClerkProvider>{children}</ConvexClerkProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
