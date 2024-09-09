import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import RecipeBookDetailPageHeader from "@/components/recipeBooks/Detail/RecipeBookDetailPageHeader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import React from "react";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

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
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <RecipeBookDetailPageHeader recipeBookPreloaded={recipeBookPreload} />
      {/* <PageHeader
        title={`${recipeBookId} Recipes`}
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            <LinkButton title="New" icon="add" href="/app/new-recipe-book" />
          </>
        }
      /> */}
      <main className="relative h-full flex flex-col items-center justify-start py-8"></main>
    </main>
  );
};

export default RecipeBookPage;
