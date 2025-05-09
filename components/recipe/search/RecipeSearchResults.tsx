import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import NoContent from "@/components/global/content/NoContent";
import RecipeListPaginated from "@/components/recipe/item/RecipeListPaginated";

import { RECIPES_SEARCH_INITIAL_COUNT } from "@/constants/pagination";
import { Privilage } from "@/enums";

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
  dateMiliseconds?: number;
}

const RecipeSearchResults = ({
  groupId,
  searchTerm,
  searchTags,
  privilage,
  showTags = false,
  dateMiliseconds,
}: RecipeSearchResultsProps) => {
  const t = useTranslations("Recipes");

  const filteredRecipesPaginated = usePaginatedQuery(
    api.recipes.getRecipes,
    {
      groupId,
      searchTerm: searchTerm,
      searchTags: searchTags,
      dateMiliseconds,
    },
    { initialNumItems: RECIPES_SEARCH_INITIAL_COUNT },
  );

  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 @container">
      {!dateMiliseconds && <h3>{t("General.SearchResults")}</h3>}

      {!filteredRecipesPaginated && (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      )}
      {filteredRecipesPaginated.status !== "LoadingFirstPage" &&
        !!(searchTerm || searchTags.length || dateMiliseconds) && (
          <>
            {!filteredRecipesPaginated.results.length ? (
              <NoContent subTitle={t("SearchInput.Empty.Search")} />
            ) : (
              <RecipeListPaginated
                recipeListPaginated={filteredRecipesPaginated}
                privilage={privilage}
                showTags={showTags}
                groupByPlannerDate={!!dateMiliseconds}
              />
            )}
          </>
        )}
    </div>
  );
};

export default RecipeSearchResults;
