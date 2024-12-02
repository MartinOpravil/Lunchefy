"use client";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import { FunctionReference } from "convex/server";
import { HttpResponseCode } from "@/enums";
import Image from "next/image";
import LinkButton from "./LinkButton";
import { ConvexResponse } from "@/lib/communication";
import { useTranslations } from "next-intl";

interface ErrorHandlerPreloadedProps {
  preloadedData: Preloaded<FunctionReference<"query">>; // Preloaded query data type
}

const ErrorHandlerPreloaded = ({
  preloadedData,
}: ErrorHandlerPreloadedProps) => {
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

  if (response.data) {
    return <></>;
  }

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
      <LinkButton href="/app" icon="back" title="Return" />
    </div>
  );
};

export default ErrorHandlerPreloaded;
