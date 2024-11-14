import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import RecipePage from "./RecipePage";

interface RecipeDetailServerPageProps {
  params: { recipeId: Id<"recipes"> };
}

const RecipeServerPage = async ({
  params: { recipeId },
}: RecipeDetailServerPageProps) => {
  const token = await getAuthToken();
  const recipePreload = await preloadQuery(
    api.recipes.getRecipeById,
    {
      id: recipeId,
      checkPrivilages: true,
    },
    { token }
  );

  return <RecipePage recipePreloaded={recipePreload} />;
};

export default RecipeServerPage;
