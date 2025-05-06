import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import RecipeDetailPage from "./RecipeDetailPage";
import ContentHandler from "@/components/global/content/ContentHandler";

interface RecipeDetailServerPageProps {
  params: Promise<{ recipeId: Id<"recipes"> }>;
}

const RecipeDetailServerPage = async ({
  params,
}: RecipeDetailServerPageProps) => {
  const recipeId = (await params).recipeId;

  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const recipePreloadPromise = preloadQuery(
    api.recipes.getRecipeById,
    {
      id: recipeId,
      checkPrivilages: true,
    },
    { token }
  );

  const [userPreload, recipePreload] = await Promise.all([
    userPreloadPromise,
    recipePreloadPromise,
  ]);

  return (
    <ContentHandler preloadedData={recipePreload}>
      <RecipeDetailPage
        recipePreloaded={recipePreload}
        userPreload={userPreload}
      />
    </ContentHandler>
  );
};

export default RecipeDetailServerPage;
