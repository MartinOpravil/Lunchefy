import { cn } from "@/lib/utils";
import Image from "next/image";
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
      {/* <Image
        src="/icons/no_content.svg"
        alt="no_content"
        width={200}
        height={200}
        className="icon-primary pt-8"
      /> */}
    </div>
  );
};

export default NoContent;
