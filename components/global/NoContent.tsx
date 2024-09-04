import Image from "next/image";
import React from "react";

const NoContent = ({
  title = "No content",
  subTitle,
}: {
  title?: string;
  subTitle?: string;
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-primary">{title}</h3>
      <p>{subTitle}</p>
      <Image
        src="/icons/no_content.svg"
        alt="no_content"
        width={200}
        height={200}
        className="icon-primary pt-8"
      />
    </div>
  );
};

export default NoContent;
