import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import RecipePage from "./RecipePage";
import ContentHandler from "@/components/global/content/ContentHandler";

interface RecipeDetailServerPageProps {
  params: Promise<{ recipeId: Id<"recipes"> }>;
}

const RecipeServerPage = async ({ params }: RecipeDetailServerPageProps) => {
  const recipeId = (await params).recipeId;

  const token = await getAuthToken();
  const recipePreload = await preloadQuery(
    api.recipes.getRecipeById,
    {
      id: recipeId,
      checkPrivilages: false,
    },
    { token }
  );

  return (
    <ContentHandler preloadedData={recipePreload}>
      <RecipePage recipePreloaded={recipePreload} />
    </ContentHandler>
  );
};

export default RecipeServerPage;
