import { useMemo } from "react";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { useTagManager } from "@/hooks/TagManager";
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
  }, [recipeTags, convertToTags, dense]);

  return (
    <div
      className={cn("flex flex-wrap justify-center gap-1 gap-y-1.5", {
        "justify-center gap-1": dense,
      })}
    >
      {tags.map((tag, index) => (
        <Badge
          key={index}
          className={cn(
            "hover:bg-default flex select-none gap-2 bg-secondary px-2 text-white-1",
            { "bg-transparent px-0": dense },
          )}
        >
          <Image
            unoptimized
            src={`/icons/tags/${tag.value}.svg`}
            alt="Tag"
            width={25}
            height={25}
            className={cn("!h-[25px] !w-[25px]", {
              "!h-[22px] !w-[22px]": dense,
            })}
            style={{ filter: darkMode || !dense ? "invert(100%)" : "" }}
          />
          {useName && <div className="text-[14px]">{tag.label}</div>}
        </Badge>
      ))}
      {hasMore && (
        <div className="text-12 flex items-center justify-center pb-[0.15rem]">
          +{moreCount}
        </div>
      )}
    </div>
  );
};

export default RecipeTagList;
