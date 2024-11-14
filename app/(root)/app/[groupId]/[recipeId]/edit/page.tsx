import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import RecipeDetailPage from "./RecipeDetailPage";

interface RecipeDetailServerPageProps {
  params: { recipeId: Id<"recipes"> };
}

const RecipeDetailServerPage = async ({
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

  return <RecipeDetailPage recipePreloaded={recipePreload} />;
};

export default RecipeDetailServerPage;
