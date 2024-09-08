import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import TestingElement from "@/components/global/TestingElement";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { preloadQuery } from "convex/nextjs";

const RecipeBookDetail = async ({
  params: { recipeBookId },
}: {
  params: { recipeBookId: Id<"recipeBooks"> };
}) => {
  // const recipeBook = useQuery(api.recipeBooks.getRecipeBookById, {
  //   id: recipeBookId,
  // });
  const preloaded = await preloadQuery(api.recipeBooks.getRecipeBookById, {
    id: recipeBookId,
  });
  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      {/* <PageHeader
        title={`Detail`}
        icon="recipe_book"
        actionButton={<LinkButton title="Back" icon="back" href="/app" />}
      /> */}
      <TestingElement preloadedTasks={preloaded} />
      <main className="pt-6"></main>
    </main>
  );
};

export default RecipeBookDetail;
