import { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import NoContent from "@/components/global/content/NoContent";
import PlannerRecipeListPaginated from "@/components/planner/search/PlannerRecipeListPaginated";

import { RECIPES_SEARCH_INITIAL_COUNT } from "@/constants/pagination";
import { Privilage } from "@/enums";

interface PlannerRecipeResultListProps {
  groupId: Id<"groups">;
  searchTerm: string;
  searchTags: string[];
  selectRecipeIdForAction: Dispatch<SetStateAction<string | undefined>>;
  selectedRecipeId?: string;
  dateMiliseconds?: number;
}

const PlannerRecipeResultList = ({
  groupId,
  searchTerm,
  searchTags,
  selectRecipeIdForAction,
  selectedRecipeId,
  dateMiliseconds,
}: PlannerRecipeResultListProps) => {
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
    <div className="flex w-full flex-col items-start justify-center gap-2 @container">
      {!filteredRecipesPaginated && (
        <Loader2 className="my-4 h-8 w-8 animate-spin" />
      )}
      {filteredRecipesPaginated.status !== "LoadingFirstPage" &&
        !!(searchTerm || searchTags.length || dateMiliseconds) && (
          <>
            {!filteredRecipesPaginated.results.length ? (
              <NoContent subTitle={t("SearchInput.Empty.Search")} />
            ) : (
              <PlannerRecipeListPaginated
                recipeListPaginated={filteredRecipesPaginated}
                selectRecipeIdForAction={selectRecipeIdForAction}
                selectedRecipeId={selectedRecipeId}
              />
            )}
          </>
        )}
    </div>
  );
};

export default PlannerRecipeResultList;
