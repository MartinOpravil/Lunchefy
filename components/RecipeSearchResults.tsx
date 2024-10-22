import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import React from "react";

interface RecipeSearchResultsProps {
  recipeBookId: string;
  searchTerm: string;
}

const RecipeSearchResults = ({
  recipeBookId,
  searchTerm,
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
    <div className="flex flex-col gap-2 justify-center items-center">
      <h3>Filtered results:</h3>
      {filteredRecipes.results.map((x, index) => (
        <div key={index}>{x.name}</div>
      ))}

      {/* Handle all status representations */}
      <div
        onClick={() => filteredRecipes.loadMore(2)}
        className="p-2 bg-secondary"
      >
        {filteredRecipes.status === "CanLoadMore" ? "Load more" : "All loaded"}
      </div>
    </div>
  );
};

export default RecipeSearchResults;
