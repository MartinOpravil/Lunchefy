import React from "react";
import { useTagManager } from "./TagManager";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface RecipeTagListProps {
  recipeTags: string;
  useName?: boolean;
}

const RecipeTagList = ({ recipeTags, useName = false }: RecipeTagListProps) => {
  const { convertToTags } = useTagManager();

  return (
    <div className="flex flex-wrap gap-1 gap-y-1.5">
      {convertToTags(recipeTags)
        .sort((a, b) => (a.label > b.label ? 1 : -1))
        .map((tag, index) => (
          <Badge
            key={index}
            className="flex gap-2 bg-secondary text-white-1 px-2 select-none"
          >
            <Image
              unoptimized
              src={`/icons/tags/${tag.value}.svg`}
              alt="Tag"
              width={25}
              height={25}
              className="!w-[25px] !h-[25px]"
              style={{ filter: "invert(100%)" }}
            />
            {useName && <div className="text-[14px]">{tag.label}</div>}
          </Badge>
        ))}
    </div>
  );
};

export default RecipeTagList;
