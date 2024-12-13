import Header from "@/components/header/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lunchefy",
  description: "Your ultimate recipe manager and dish decider.",
  icons: {
    icon: "/logo_mini.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col relative px-4 w-full md:max-w-[1024px] lg:px-0 m-auto h-screen bg-background">
      <Header />
      {children}
    </main>
  );
}
