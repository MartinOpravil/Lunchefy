import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import RecipeBookDetailPageHeader from "@/components/recipeBooks/Detail/RecipeBookDetailPageHeader";
import RecipeBookDetailForm from "@/components/recipeBooks/Detail/RecipeBookDetailForm";
import ErrorHandler from "@/components/global/ErrorHandler";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

const RecipeBookDetail = async ({
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
  return (
    <main className="page">
      <RecipeBookDetailPageHeader recipeBookPreloaded={recipeBookPreload} />
      <main className="page-content">
        <ErrorHandler preloadedData={recipeBookPreload} />
        <RecipeBookDetailForm recipeBookPreloaded={recipeBookPreload} />
      </main>
    </main>
  );
};

export default RecipeBookDetail;
