"use client";

import { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";
import { Mouse, Plus } from "lucide-react";

import ChosenImage from "@/components/global/image/ChosenImage";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";

import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { cn } from "@/lib/utils";

interface PlannerRecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  selectRecipeIdForAction: Dispatch<SetStateAction<string | undefined>>;
  selectedRecipeId?: string;
}

const PlannerRecipeListPaginated = ({
  recipeListPaginated,
  selectRecipeIdForAction,
  selectedRecipeId,
}: PlannerRecipeListPaginatedProps) => {
  const t = useTranslations("Recipes.Scroll");
  return (
    <>
      <div className="relative flex h-40 w-full flex-col gap-1 overflow-y-auto pt-2 text-text">
        {recipeListPaginated.results?.map((recipe, index) => (
          <div
            className={cn(
              "group flex cursor-pointer items-center justify-between gap-2 rounded-lg p-1 transition hover:bg-primary/50",
              selectedRecipeId === recipe._id && "bg-secondary",
            )}
            key={index}
            onClick={() =>
              selectRecipeIdForAction && selectRecipeIdForAction(recipe._id)
            }
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "relative flex !h-[50px] min-h-[50px] w-[50px] min-w-[50px] items-center justify-center overflow-hidden rounded-lg bg-accent/30",
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
            <div className="relative h-12 w-full">
              <Skeleton className="h-full w-full bg-accent/70" />
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-2 text-white-1">
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
