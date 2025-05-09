import Image from "next/image";

import { CalendarFold } from "lucide-react";

import { cn, getTimeLocale } from "@/lib/utils";
import { Author } from "@/types";

interface RecipeChangeBannerProps {
  author: Author;
  className?: string;
}

const RecipeChangeBanner = ({ author, className }: RecipeChangeBannerProps) => {
  const locale = getTimeLocale();

  return (
    <div
      className={cn(
        "flex flex-col gap-x-8 gap-y-2 pt-2 text-text2 sm:flex-row sm:pt-0",
        className,
      )}
    >
      <div className="text-14 sm:text-16 flex items-center justify-end gap-3">
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
      <div className="text-14 sm:text-16 flex items-center justify-end gap-2">
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
