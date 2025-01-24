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
  showTags?: boolean;
}

const RecipeSearchResults = ({
  groupId,
  searchTerm,
  searchTags,
  privilage,
  showTags = false,
}: RecipeSearchResultsProps) => {
  const t = useTranslations("Recipes");

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
      <h3>{t("General.SearchResults")}</h3>

      {!filteredRecipesPaginated && (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      )}
      {filteredRecipesPaginated.status !== "LoadingFirstPage" &&
        !!(searchTerm || searchTags.length) && (
          <>
            {!filteredRecipesPaginated.results.length ? (
              <NoContent subTitle={t("SearchInput.Empty.Search")} />
            ) : (
              <RecipeListPaginated
                recipeListPaginated={filteredRecipesPaginated}
                privilage={privilage}
                showTags={showTags}
              />
            )}
          </>
        )}
    </div>
  );
};

export default RecipeSearchResults;
