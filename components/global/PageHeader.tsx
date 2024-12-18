"use client";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Image from "next/image";
import React, { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  topSide?: ReactNode;
  leftSide?: ReactNode;
  rightSide?: ReactNode;
  showIcon?: boolean;
  titleClassName?: string;
}

const PageHeader = ({
  icon,
  title,
  description,
  topSide,
  leftSide,
  rightSide,
  showIcon = true,
  titleClassName,
}: PageHeaderProps) => {
  return (
    <nav className="relative">
      <div className="flex flex-wrap gap-2 gap-y-6 justify-between items-end">
        <div className="flex flex-col">
          <h2 className={cn("flex items-center gap-3", titleClassName)}>
            {showIcon && (
              <div className="rounded-full bg-primary p-2">{icon}</div>
            )}
            {title}
          </h2>
          {description && <p className="text-14 italic">{`${description}`}</p>}
        </div>
        <div className="flex flex-grow items-center justify-end gap-2 flex-wrap">
          {topSide}
        </div>
      </div>
      <div className="heading-underline" />
      {(leftSide || rightSide) && (
        <div className="flex justify-between items-center gap-2 flex-wrap">
          {leftSide && <div className="flex gap-2">{leftSide}</div>}
          {rightSide && <div className="flex gap-2">{rightSide}</div>}
        </div>
      )}
    </nav>
  );
};

export default PageHeader;
