import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import Recipes from "./recipes/RecipesPaginated";
import { Privilage } from "@/enums";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import NoContent from "./global/NoContent";
import { RECIPES_SEARCH_INITIAL_COUNT } from "@/constants/pagination";

interface RecipeSearchResultsProps {
  recipeBookId: Id<"recipeBooks">;
  searchTerm: string;
  privilage: Privilage;
}

const RecipeSearchResults = ({
  recipeBookId,
  searchTerm,
  privilage,
}: RecipeSearchResultsProps) => {
  const filteredRecipesPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      recipeBookId: recipeBookId,
      searchTerm: searchTerm,
    },
    { initialNumItems: RECIPES_SEARCH_INITIAL_COUNT }
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <h3>Search results:</h3>
      {!filteredRecipesPaginated && (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      )}
      {filteredRecipesPaginated.status !== "LoadingFirstPage" && (
        <>
          {!filteredRecipesPaginated.results.length ? (
            <NoContent title="This recipe book does not have searched recipe" />
          ) : (
            <Recipes
              recipesPaginated={filteredRecipesPaginated}
              privilage={privilage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RecipeSearchResults;
