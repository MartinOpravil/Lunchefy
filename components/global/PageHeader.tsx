"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Image from "next/image";
import React, { ReactNode } from "react";

const PageHeader = ({
  title,
  icon,
  actionButton,
}: {
  title: string;
  icon: string;
  actionButton?: ReactNode;
}) => {
  return (
    <nav className="relative">
      <div className="flex items-end flex-wrap gap-2 gap-y-6 justify-between">
        <h2 className="text-primary flex items-start gap-3">
          <Image
            src={`/icons/${icon}.svg`}
            alt="recipe_book"
            width={30}
            height={30}
            className="icon-primary"
          />
          {title}
        </h2>
        <div className="flex flex-grow items-center justify-end gap-2 flex-wrap">
          {actionButton}
        </div>
      </div>

      <div className="heading-underline" />
    </nav>
  );
};

export default PageHeader;
