import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import React, { Dispatch, SetStateAction } from "react";
import { Privilage } from "@/enums";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import NoContent from "./global/NoContent";
import { RECIPES_SEARCH_INITIAL_COUNT } from "@/constants/pagination";
import PlannerRecipeListPaginated from "./recipes/PlannerRecipeListPaginated";
import { useTranslations } from "next-intl";

interface PlannerRecipeResultListProps {
  groupId: Id<"groups">;
  searchTerm: string;
  searchTags: string[];
  privilage: Privilage;
  selectResultAction: Dispatch<SetStateAction<string | undefined>>;
  selectedRecipeId?: string;
  dateMiliseconds?: number;
}

const PlannerRecipeResultList = ({
  groupId,
  searchTerm,
  searchTags,
  privilage,
  selectResultAction,
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
    { initialNumItems: RECIPES_SEARCH_INITIAL_COUNT }
  );

  return (
    <div className="flex flex-col gap-2 justify-center items-start w-full @container">
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
                privilage={privilage}
                selectResultAction={selectResultAction}
                selectedRecipeId={selectedRecipeId}
              />
            )}
          </>
        )}
    </div>
  );
};

export default PlannerRecipeResultList;
