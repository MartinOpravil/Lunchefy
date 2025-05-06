import { cn } from "@/lib/utils";
import React from "react";

const NoContent = ({
  title,
  subTitle,
}: {
  title?: string;
  subTitle?: string;
}) => {
  return (
    <div className="w-full flex flex-col items-center text-center gap-3">
      <h2 className="text-primary">{title}</h2>
      <h3 className={cn({ "text-text2": !title })}>{subTitle}</h3>
    </div>
  );
};

export default NoContent;
