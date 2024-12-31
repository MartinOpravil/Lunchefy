import Header from "@/components/header/Header";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.Metadata");
  return {
    title: "Lunchefy",
    description: t("Description"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col relative px-4 w-full md:max-w-[1024px] lg:px-0 m-auto bg-background">
      <Header />
      {children}
    </main>
  );
}
