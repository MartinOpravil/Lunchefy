"use client";

import { ReactNode, useMemo } from "react";

import { useTranslations } from "next-intl";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { ArrowLeft, FileLock2, FileX2 } from "lucide-react";

import LinkButton from "@/components/global/button/LinkButton";
import LoaderSpinner from "@/components/global/content/LoaderSpinner";

import { HttpResponseCode } from "@/enums";
import { ConvexResponse } from "@/lib/communication";

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
        image = <FileX2 className="!h-[150px] !w-[150px] text-primary" />;
        break;
      case HttpResponseCode.Forbidden:
        title = t("Validation.NoPermission");
        image = <FileLock2 className="!h-[150px] !w-[150px] text-primary" />;
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
      <div className="page flex min-h-[600px] w-full flex-grow flex-col items-center justify-center gap-10">
        {response.status === HttpResponseCode.Unauthorized ? (
          <LoaderSpinner classList="text-primary !w-[130px] !h-[130px]" />
        ) : (
          <>
            {image}
            <div className="flex flex-col items-center justify-center gap-4 text-center">
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
