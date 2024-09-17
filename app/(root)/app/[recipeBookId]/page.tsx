import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeBookDetailPageHeader from "@/components/recipeBooks/Detail/RecipeBookDetailPageHeader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";

const RecipeBookPage = async ({
  params: { recipeBookId },
}: {
  params: { recipeBookId: Id<"recipeBooks"> };
}) => {
  const token = await getAuthToken();
  const recipeBookPreload = await preloadQuery(
    api.recipeBooks.getRecipeBookById,
    {
      id: recipeBookId,
    },
    { token }
  );
  return (
    <main className="page">
      <RecipeBookDetailPageHeader recipeBookPreloaded={recipeBookPreload} />
      <main className="page-content">
        <ErrorHandler preloadedData={recipeBookPreload} />
      </main>
    </main>
  );
};

export default RecipeBookPage;
