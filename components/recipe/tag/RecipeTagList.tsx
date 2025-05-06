import React, { useMemo } from "react";
import { useTagManager } from "./TagManager";
import Image from "next/image";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";

interface RecipeTagListProps {
  recipeTags: string;
  useName?: boolean;
  dense?: boolean;
}

const maxTangListLenght = 6;

const RecipeTagList = ({
  recipeTags,
  useName = false,
  dense = false,
}: RecipeTagListProps) => {
  const { convertToTags } = useTagManager();
  const { darkMode } = useGlobalStore();

  const { tags, hasMore, moreCount } = useMemo(() => {
    let tags = convertToTags(recipeTags);
    let hasMore = false;
    let moreCount = 0;

    if (dense) {
      if (tags.length > maxTangListLenght) {
        tags = tags.slice(0, maxTangListLenght - 1);
        hasMore = true;
        moreCount = maxTangListLenght + 1 - tags.length;
      }
    } else {
      tags = tags.sort((a, b) => (a.label > b.label ? 1 : -1));
    }

    return {
      tags,
      hasMore,
      moreCount,
    };
  }, [recipeTags, convertToTags]);

  return (
    <div
      className={cn("flex flex-wrap gap-1 gap-y-1.5 justify-center", {
        "gap-1 justify-center": dense,
      })}
    >
      {tags.map((tag, index) => (
        <Badge
          key={index}
          className={cn(
            "flex gap-2 bg-secondary text-white-1 px-2 select-none hover:bg-default",
            { "bg-transparent px-0": dense }
          )}
        >
          <Image
            unoptimized
            src={`/icons/tags/${tag.value}.svg`}
            alt="Tag"
            width={25}
            height={25}
            className={cn("!w-[25px] !h-[25px]", {
              "!w-[22px] !h-[22px]": dense,
            })}
            style={{ filter: darkMode || !dense ? "invert(100%)" : "" }}
          />
          {useName && <div className="text-[14px]">{tag.label}</div>}
        </Badge>
      ))}
      {hasMore && (
        <div className="flex items-center justify-center text-12 pb-[0.15rem]">
          +{moreCount}
        </div>
      )}
    </div>
  );
};

export default RecipeTagList;
