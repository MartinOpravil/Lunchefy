"use client";
import { HttpResponseCode } from "@/enums";
import { ConvexResponse } from "@/lib/communication";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { useTranslations } from "next-intl";
import React, { ReactNode, useMemo } from "react";
import Image from "next/image";
import LinkButton from "./LinkButton";
import { ArrowLeft } from "lucide-react";

interface ContentHandlerProps {
  children: ReactNode;
  preloadedData: Preloaded<FunctionReference<"query">>;
}

const ContentHandler = ({ children, preloadedData }: ContentHandlerProps) => {
  const t = useTranslations("Global");
  const response = usePreloadedQuery(preloadedData) as ConvexResponse<null>;

  const { title, image } = useMemo(() => {
    let title,
      image = "";

    switch (response.status) {
      case HttpResponseCode.NotFound:
        title = t("Validation.NoContent");
        image = "no_content";
        break;
      case HttpResponseCode.Forbidden:
        title = t("Validation.NoPermission");
        image = "no_access";
        break;
      default:
        break;
    }

    return {
      title,
      image,
    };
  }, [response.status, t]);

  if (!response.data) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-10">
        <Image
          src={`/icons/${image}.svg`}
          alt="Error image"
          width={200}
          height={200}
        />
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <h1 className="text-7xl">{response.status}</h1>
          <h3>{title}</h3>
        </div>
        <LinkButton href="/app" icon={<ArrowLeft />} title={t("Button.Back")} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ContentHandler;
