import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { UsePaginatedQueryReturnType } from "convex/react";
import { PaginationResult } from "convex/server";

import Recipe from "@/components/recipe/item/Recipe";
import RecipeListPaginated from "@/components/recipe/item/RecipeListPaginated";

import { Privilage } from "@/enums";

interface DefaultOrPaginatedResultsProps {
  initialRecipeList: PaginationResult<Doc<"recipes">>;
  recipeList: UsePaginatedQueryReturnType<typeof api.recipes.getRecipes>;
  privilage: Privilage;
  isShowingRecipeTags: boolean;
}

const DefaultOrPaginatedResults = ({
  initialRecipeList,
  recipeList,
  privilage,
  isShowingRecipeTags,
}: DefaultOrPaginatedResultsProps) => {
  if (!!initialRecipeList.page.length && !recipeList.results.length) {
    return (
      <div className="recipe-grid">
        {initialRecipeList.page.map((recipe) => (
          <Recipe
            recipe={recipe}
            key={recipe._id}
            privilage={privilage}
            showTags={isShowingRecipeTags}
          />
        ))}
      </div>
    );
  }
  return (
    <RecipeListPaginated
      recipeListPaginated={recipeList}
      privilage={privilage}
      showTags={isShowingRecipeTags}
    />
  );
};

export default DefaultOrPaginatedResults;
