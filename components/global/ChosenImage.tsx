"use client";
import React, { useEffect, useMemo, useState } from "react";
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
}

const ChosenImage = ({
  image,
  onClick,
  variant = ChosenImageVariant.Fullscreen,
  content = ChosenImageContent.All,
  classList,
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
      className={cn("w-[100%] h-[100%] select-none", {
        "sm:w-[75%] max-h-[500px]":
          variant === ChosenImageVariant.ImageInputPreview,
        "cursor-pointer": !!onClick,
      })}
      onClick={onClick}
    >
      {image && (
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
            "w-[100%] h-[100%] object-cover",
            {
              "absolute hidden": !isVisible,
              "object-contain rounded-xl":
                variant === ChosenImageVariant.ImageInputPreview,
            },
            classList
          )}
          onError={() => {
            setIsVisible(false);
          }} // Hide the image on error
          onLoad={() => {
            setIsVisible(true);
          }} // Show the image when it successfully loads
        />
      )}
      {(!isVisible || !image) && (
        <div
          className={cn(
            "w-full h-full rounded-xl flex justify-center items-center",
            {
              "bg-accent/30 min-h-[250px]":
                variant === ChosenImageVariant.ImageInputPreview,
            }
          )}
        >
          <ImageLucide className="!w-16 !h-16 text-accent transition-all group-hover:scale-105" />
        </div>
      )}
    </div>
  );
};

export default ChosenImage;
