import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import React from "react";
import Recipes from "./recipes/Recipes";
import { Privilage } from "@/enums";

interface RecipeSearchResultsProps {
  recipeBookId: string;
  searchTerm: string;
  privilage: Privilage;
}

const RecipeSearchResults = ({
  recipeBookId,
  searchTerm,
  privilage,
}: RecipeSearchResultsProps) => {
  const filteredRecipes = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      recipeBookId: recipeBookId,
      searchTerm: searchTerm,
    },
    {
      initialNumItems: 3,
    }
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full">
      <h3>Search results:</h3>

      {/* Handle all status representations */}
      <div
        onClick={() => filteredRecipes.loadMore(2)}
        className="p-2 bg-secondary"
      >
        {filteredRecipes.status === "CanLoadMore" ? "Load more" : "All loaded"}
      </div>
      <Recipes recipes={filteredRecipes.results} privilage={privilage} />
    </div>
  );
};

export default RecipeSearchResults;
