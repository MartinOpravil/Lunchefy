import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import RecipeBookPage from "./RecipeBookPage";

const RecipeBookServerPage = async ({
  params: { recipeBookId },
}: {
  params: { recipeBookId: Id<"recipeBooks"> };
}) => {
  const token = await getAuthToken();
  const recipeBookPreloadPromise = preloadQuery(
    api.recipeBooks.getRecipeBookById,
    {
      id: recipeBookId,
    },
    { token }
  );
  const recipesPreloadPromise = preloadQuery(
    api.recipes.getRecipes,
    { recipeBookId: recipeBookId },
    { token }
  );

  const [recipeBookPreload, recipesPreload] = await Promise.all([
    recipeBookPreloadPromise,
    recipesPreloadPromise,
  ]);

  return (
    <RecipeBookPage
      recipeBookPreloaded={recipeBookPreload}
      recipesPreloaded={recipesPreload}
    />
  );
};

export default RecipeBookServerPage;
