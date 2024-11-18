"use client";
import React from "react";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import InfiniteScroll from "../ui/infinite-scroll";
import { Mouse } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UsePaginatedQueryReturnType } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RECIPES_NEXT_COUNT } from "@/constants/pagination";

interface RecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  privilage: Privilage;
}

const RecipeListPaginated = ({
  recipeListPaginated,
  privilage,
}: RecipeListPaginatedProps) => {
  return (
    <>
      <div className="recipe-grid">
        {recipeListPaginated.results?.map((recipe) => (
          <Recipe
            key={recipe._id}
            id={recipe._id}
            groupId={recipe.groupId}
            title={recipe.name}
            description={recipe.description}
            imageUrl={recipe.coverImage?.imageUrl}
            privilage={privilage}
          />
        ))}
        <InfiniteScroll
          hasMore={recipeListPaginated.status === "CanLoadMore"}
          isLoading={recipeListPaginated.isLoading ?? false}
          next={() => recipeListPaginated.loadMore(RECIPES_NEXT_COUNT)}
          threshold={1}
        >
          {recipeListPaginated.status !== "Exhausted" && (
            <div className="h-full w-full relative">
              <Skeleton className="h-full w-full bg-accent/70" />
              <div className="absolute top-0 left-0 w-full h-full text-white-1 flex flex-col justify-center items-center gap-2">
                <Mouse />
                <div className="text-center">
                  Scroll down to
                  <h3>Load more</h3>
                </div>
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default RecipeListPaginated;