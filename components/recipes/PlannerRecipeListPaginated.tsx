"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Privilage } from "@/enums";
import InfiniteScroll from "../ui/infinite-scroll";
import { Mouse, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UsePaginatedQueryReturnType } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ChosenImage from "../global/ChosenImage";

interface PlannerRecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  privilage: Privilage;
  selectResultAction: Dispatch<SetStateAction<string | undefined>>;
  selectedRecipeId?: string;
}

const PlannerRecipeListPaginated = ({
  recipeListPaginated,
  privilage,
  selectResultAction,
  selectedRecipeId,
}: PlannerRecipeListPaginatedProps) => {
  const t = useTranslations("Recipes.Scroll");
  return (
    <>
      <div className="text-text flex flex-col w-full gap-1 pt-2 h-40 relative overflow-y-auto">
        {recipeListPaginated.results?.map((recipe, index) => (
          <div
            className={cn(
              "flex gap-2 justify-between items-center p-1 rounded-lg hover:bg-primary/50 cursor-pointer transition group",
              selectedRecipeId === recipe._id && "bg-secondary"
            )}
            key={index}
            onClick={() => selectResultAction && selectResultAction(recipe._id)}
          >
            <div className="flex gap-3 items-center ">
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-lg overflow-hidden bg-accent/30 min-h-[50px] min-w-[50px] w-[50px] !h-[50px]"
                )}
              >
                <ChosenImage
                  image={recipe.coverImage}
                  classList="transition-all group-hover:scale-105"
                />
              </div>
              <h4>{recipe.name}</h4>
            </div>
            <div className="pr-2">
              <Plus />
            </div>
          </div>
        ))}
        <InfiniteScroll
          hasMore={recipeListPaginated.status === "CanLoadMore"}
          isLoading={recipeListPaginated.isLoading ?? false}
          next={() => recipeListPaginated.loadMore(RECIPES_NEXT_COUNT)}
          threshold={1}
        >
          {recipeListPaginated.status !== "Exhausted" && (
            <div className="h-12 w-full relative">
              <Skeleton className="h-full w-full bg-accent/70" />
              <div className="absolute top-0 left-0 w-full h-full text-white-1 flex justify-center items-center gap-2">
                <Mouse />
                <div>{t("Full")}</div>
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default PlannerRecipeListPaginated;
