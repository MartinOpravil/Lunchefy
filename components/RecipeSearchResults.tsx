import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import React from "react";
import RecipeListPaginated from "./recipes/RecipeListPaginated";
import { Privilage } from "@/enums";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import NoContent from "./global/NoContent";
import { RECIPES_SEARCH_INITIAL_COUNT } from "@/constants/pagination";
import { useTranslations } from "next-intl";

export enum RecipeSearchResultListVariant {
  Page = "page",
  Planner = "planner",
}
interface RecipeSearchResultsProps {
  groupId: Id<"groups">;
  searchTerm: string;
  searchTags: string[];
  privilage: Privilage;
}

const RecipeSearchResults = ({
  groupId,
  searchTerm,
  searchTags,
  privilage,
}: RecipeSearchResultsProps) => {
  const t = useTranslations("Recipes.General");

  const filteredRecipesPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      groupId,
      searchTerm: searchTerm,
      searchTags: searchTags,
    },
    { initialNumItems: RECIPES_SEARCH_INITIAL_COUNT }
  );

  return (
    <div className="flex flex-col gap-4 justify-center items-start w-full @container">
      <h3>{t("SearchResults")}</h3>

      {!filteredRecipesPaginated && (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      )}
      {filteredRecipesPaginated.status !== "LoadingFirstPage" &&
        !!(searchTerm || searchTags.length) && (
          <>
            {!filteredRecipesPaginated.results.length ? (
              <NoContent title="No recipe match search criteria." />
            ) : (
              <RecipeListPaginated
                recipeListPaginated={filteredRecipesPaginated}
                privilage={privilage}
              />
            )}
          </>
        )}
    </div>
  );
};

export default RecipeSearchResults;
