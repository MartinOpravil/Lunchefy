"use client";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import { FunctionReference } from "convex/server";
import { HttpResponseCode } from "@/enums";
import { ConvexResponse } from "@/convex/recipeBooks";
import Image from "next/image";
import LinkButton from "./LinkButton";

interface ErrorHandlerProps {
  preloadedData: Preloaded<FunctionReference<"query">>; // Preloaded query data type
}

const ErrorHandler = ({ preloadedData }: ErrorHandlerProps) => {
  const response = usePreloadedQuery(preloadedData) as ConvexResponse<null>;

  const { title, image } = useMemo(() => {
    let title,
      image = "";

    switch (response.status) {
      case HttpResponseCode.NotFound:
        title = "Content does not exists.";
        image = "no_content";
        break;
      case HttpResponseCode.Forbidden:
        title = "You don't have a permission to see this content.";
        image = "no_access";
        break;
      default:
        break;
    }

    return {
      title,
      image,
    };
  }, [response.status]);

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

export default ErrorHandler;
