import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/authentication";
import RecipeBookDetailPage from "./RecipeBookDetailPage";

const RecipeBookDetailServerPage = async ({
  params: { recipeBookId },
}: {
  params: { recipeBookId: Id<"recipeBooks"> };
}) => {
  const token = await getAuthToken();
  const recipeBookPreload = await preloadQuery(
    api.recipeBooks.getRecipeBookById,
    {
      id: recipeBookId,
      checkPrivilages: true,
    },
    { token }
  );

  return <RecipeBookDetailPage recipeBookPreloaded={recipeBookPreload} />;
};

export default RecipeBookDetailServerPage;
