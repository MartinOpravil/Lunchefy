"use client";
import { HttpResponseCode } from "@/enums";
import { ConvexResponse } from "@/lib/communication";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { useTranslations } from "next-intl";
import React, { ReactNode, useMemo } from "react";
import LinkButton from "./LinkButton";
import { ArrowLeft, FileLock2, FileX2 } from "lucide-react";
import LoaderSpinner from "./LoaderSpinner";

interface ContentHandlerProps {
  children: ReactNode;
  preloadedData: Preloaded<FunctionReference<"query">>;
}

const ContentHandler = ({ children, preloadedData }: ContentHandlerProps) => {
  const t = useTranslations("Global");
  const response = usePreloadedQuery(preloadedData) as ConvexResponse<null>;

  const { title, image } = useMemo(() => {
    let title = "";
    let image: ReactNode;

    switch (response.status) {
      case HttpResponseCode.NotFound:
        title = t("Validation.NoContent");
        image = <FileX2 className="text-primary !w-[150px] !h-[150px]" />;
        break;
      case HttpResponseCode.Forbidden:
        title = t("Validation.NoPermission");
        image = <FileLock2 className="text-primary !w-[150px] !h-[150px]" />;
        break;
      default:
        break;
    }

    return {
      title,
      image,
    };
  }, [response.status, t]);

  if (!response.data && response.status !== HttpResponseCode.OK) {
    return (
      <div className="page w-full flex flex-col flex-grow justify-center items-center gap-10 min-h-[600px]">
        {response.status === HttpResponseCode.Unauthorized ? (
          <LoaderSpinner classList="text-primary !w-[130px] !h-[130px]" />
        ) : (
          <>
            {image}
            <div className="flex flex-col justify-center items-center gap-4 text-center">
              <h1 className="text-7xl">{response.status}</h1>
              <h3>{title}</h3>
            </div>
            <LinkButton
              href="/app"
              icon={<ArrowLeft />}
              title={t("Button.Back")}
            />
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ContentHandler;
