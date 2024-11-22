"use client";
import React, { Dispatch, SetStateAction } from "react";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import InfiniteScroll from "../ui/infinite-scroll";
import { Mouse, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UsePaginatedQueryReturnType } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  return (
    <>
      <div className="flex flex-col w-full gap-1 pt-2 h-40 relative overflow-y-auto">
        {recipeListPaginated.results?.map((recipe, index) => (
          <div
            className={cn(
              "flex gap-2 justify-between items-center p-1 rounded-lg hover:bg-primary/50 cursor-pointer transition",
              selectedRecipeId === recipe._id && "bg-secondary"
            )}
            key={index}
            onClick={() => selectResultAction && selectResultAction(recipe._id)}
          >
            <div className="flex gap-3 items-center">
              {recipe.coverImage?.imageUrl && (
                <div className="rounded-lg overflow-hidden max-w-[50px] max-h-[50px]">
                  <Image
                    src={recipe.coverImage?.imageUrl}
                    alt="recipe image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-[100%] h-[100%] object-contain"
                  />
                </div>
              )}
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
                <div>Scroll down to Load more</div>
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default PlannerRecipeListPaginated;
