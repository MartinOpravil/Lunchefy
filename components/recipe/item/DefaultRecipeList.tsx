import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { UsePaginatedQueryReturnType } from "convex/react";
import { PaginationResult } from "convex/server";

import EmptyRecipeListState from "@/components/recipe/EmptyRecipeListState";
import DefaultOrPaginatedResults from "@/components/recipe/item/DefaultOrPaginatedResults";

import { Privilage } from "@/enums";

interface DefaultRecipeListProps {
  initialRecipeList: PaginationResult<Doc<"recipes">>;
  recipeList: UsePaginatedQueryReturnType<typeof api.recipes.getRecipes>;
  privilage: Privilage;
  isShowingRecipeTags: boolean;
}

const DefaultRecipeList = ({
  initialRecipeList,
  recipeList,
  privilage,
  isShowingRecipeTags,
}: DefaultRecipeListProps) => {
  return (
    <div className="flex h-full w-full flex-grow flex-col items-center gap-3 @container">
      {!initialRecipeList.page.length ? (
        <EmptyRecipeListState privilage={privilage} />
      ) : (
        <DefaultOrPaginatedResults
          initialRecipeList={initialRecipeList}
          recipeList={recipeList}
          privilage={privilage}
          isShowingRecipeTags={isShowingRecipeTags}
        />
      )}
    </div>
  );
};

export default DefaultRecipeList;
