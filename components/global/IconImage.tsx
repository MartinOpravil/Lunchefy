import { IconImageProps } from "@/types";
import Image from "next/image";
import React from "react";

const IconImage = ({ name, width = 15, height = 15 }: IconImageProps) => {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={width}
      height={height}
      className={`w-[${width}px] h-[${height}px]`}
    />
  );
};

export default IconImage;
