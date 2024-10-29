import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import Recipes from "./recipes/Recipes";
import { Privilage } from "@/enums";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import NoContent from "./global/NoContent";

interface RecipeSearchResultsProps {
  recipeBookId: Id<"recipeBooks">;
  searchTerm: string;
  privilage: Privilage;
}

const initialRecipeCount = 2;

const RecipeSearchResults = ({
  recipeBookId,
  searchTerm,
  privilage,
}: RecipeSearchResultsProps) => {
  const filteredRecipes = useQuery(api.recipes.getRecipes, {
    recipeBookId: recipeBookId,
    searchTerm: searchTerm,
    paginationOpts: {
      numItems: initialRecipeCount,
      cursor: null,
    },
  });

  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <h3>Search results:</h3>
      {!filteredRecipes && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      {filteredRecipes && (
        <>
          {!filteredRecipes.page.length ? (
            <NoContent title="This recipe book does not have searched recipe" />
          ) : (
            <Recipes
              initialRecipes={filteredRecipes}
              recipeBookId={recipeBookId}
              searchTerm={searchTerm}
              privilage={privilage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RecipeSearchResults;
