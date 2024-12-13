"use client";
import { Users } from "lucide-react";
import Image from "next/image";
import React, { ReactNode } from "react";

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionButton?: ReactNode;
  leftSide?: ReactNode;
  rightSide?: ReactNode;
}

const PageHeader = ({
  icon,
  title,
  description,
  actionButton,
  leftSide,
  rightSide,
}: PageHeaderProps) => {
  return (
    <nav className="relative">
      {(leftSide || rightSide) && (
        <div className="flex justify-between items-center gap-2 flex-wrap">
          {leftSide && <div className="flex gap-2">{leftSide}</div>}
          {rightSide && <div className="flex gap-2">{rightSide}</div>}
        </div>
      )}
      <div className="heading-underline mb-4" />
      <div className="flex flex-wrap gap-2 gap-y-6 justify-between items-center">
        <div className="flex flex-col">
          <h2 className="flex items-center gap-3">
            <div className="rounded-full bg-primary p-2">{icon}</div>
            {title}
          </h2>
          <p className="text-14 text-primary">{description}</p>
        </div>
        <div className="flex flex-grow items-center justify-end gap-2 flex-wrap">
          {actionButton}
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
