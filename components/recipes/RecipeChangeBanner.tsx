import React from "react";
import Image from "next/image";
import {
  CalendarClock,
  CalendarFold,
  Clock,
  SquarePen,
  UserRoundPen,
} from "lucide-react";
import { Author } from "@/types";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface RecipeChangeBannerProps {
  author: Author;
  className?: string;
}

const RecipeChangeBanner = ({ author, className }: RecipeChangeBannerProps) => {
  const locale = useLocale() === "cs" ? "cs" : "en-GB";

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-x-8 gap-y-2 text-text2 pt-2 sm:pt-0",
        className
      )}
    >
      <div className="flex gap-3 items-center text-14 sm:text-16 justify-end">
        <div className="sm:order-1">{author.name}</div>
        <Image
          unoptimized
          src={author.imageSrc}
          width={30}
          height={30}
          alt="author"
          className="rounded-full"
        />
      </div>
      <div className="flex gap-2 items-center text-14 sm:text-16 justify-end">
        <CalendarFold className="!w-5" />
        <div className="flex gap-2">
          <div>
            {new Date(author.date).toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div>
            (
            {new Date(author.date).toLocaleTimeString(locale, {
              hour: "numeric",
              minute: "numeric",
            })}
            )
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeChangeBanner;
