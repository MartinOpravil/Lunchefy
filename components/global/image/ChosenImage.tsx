"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { Image as ImageLucide } from "lucide-react";

import { cn } from "@/lib/utils";
import { ImageStateProps } from "@/types";

export enum ChosenImageVariant {
  Fullscreen = "fullscreen",
  ImageInputPreview = "image-input-preview",
}

export enum ChosenImageContent {
  All = "all",
  Internal = "internal",
  External = "external",
}

interface ChosenImageProps {
  image?: ImageStateProps;
  onClick?: () => void;
  variant?: ChosenImageVariant;
  content?: ChosenImageContent;
  classList?: string;
  emptyIcon?: React.ReactNode;
}

const ChosenImage = ({
  image,
  onClick,
  variant = ChosenImageVariant.Fullscreen,
  content = ChosenImageContent.All,
  classList,
  emptyIcon,
}: ChosenImageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [image]);

  const imageSrc = useMemo(() => {
    if (content !== ChosenImageContent.External && image?.imageUrl)
      return image.imageUrl;
    if (content !== ChosenImageContent.Internal && image?.externalUrl)
      return image.externalUrl;
    return "";
  }, [image, content]);

  return (
    <div
      className={cn("h-[100%] w-[100%] select-none", {
        "max-h-[500px] sm:w-[75%]":
          variant === ChosenImageVariant.ImageInputPreview,
        "cursor-pointer": !!onClick,
      })}
      onClick={onClick}
    >
      {image && imageSrc && (
        <Image
          unoptimized={
            content !== ChosenImageContent.External && image.storageId
              ? false
              : true
          }
          key={key}
          src={imageSrc}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className={cn(
            "h-[100%] w-[100%] object-cover",
            {
              "absolute hidden": !isVisible,
              "rounded-xl object-contain":
                variant === ChosenImageVariant.ImageInputPreview,
            },
            classList,
          )}
          onError={() => {
            setIsVisible(false);
          }} // Hide the image on error
          onLoad={() => {
            setIsVisible(true);
          }} // Show the image when it successfully loads
        />
      )}
      {(!imageSrc || !isVisible || !image) && (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-xl",
            {
              "min-h-[250px] bg-accent/30":
                variant === ChosenImageVariant.ImageInputPreview,
            },
          )}
        >
          {emptyIcon ? (
            emptyIcon
          ) : (
            <ImageLucide className="!h-16 !w-16 text-accent transition-all group-hover:scale-105" />
          )}
        </div>
      )}
    </div>
  );
};

export default ChosenImage;
