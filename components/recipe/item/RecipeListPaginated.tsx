"use client";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { UsePaginatedQueryReturnType } from "convex/react";

import Recipe from "@/components/recipe/item/Recipe";
import RecipeSkeleton from "@/components/recipe/item/skeleton/RecipeSkeleton";
import InfiniteScroll from "@/components/ui/infinite-scroll";

import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { Privilage } from "@/enums";
import { cn } from "@/lib/utils";

interface RecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  privilage: Privilage;
  showTags?: boolean;
}

const RecipeListPaginated = ({
  recipeListPaginated,
  privilage,
  showTags = false,
}: RecipeListPaginatedProps) => {
  const t = useTranslations("Recipes");

  return (
    <div className="recipe-grid">
      {recipeListPaginated.results?.map((recipe) => (
        <Recipe
          key={recipe._id}
          recipe={recipe}
          privilage={privilage}
          showTags={showTags}
        />
      ))}
      <InfiniteScroll
        hasMore={recipeListPaginated.status === "CanLoadMore"}
        isLoading={recipeListPaginated.isLoading ?? false}
        next={() => recipeListPaginated.loadMore(RECIPES_NEXT_COUNT)}
        threshold={1}
      >
        <div>
          {recipeListPaginated.status !== "Exhausted" && <RecipeSkeleton />}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default RecipeListPaginated;
