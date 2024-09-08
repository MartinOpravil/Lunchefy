import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import RecipeBooks from "@/components/recipeBooks/RecipeBooks";
import LinkButton from "@/components/global/LinkButton";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

const App = async () => {
  const token = await getAuthToken();
  const recipeBookListPreload = await preloadQuery(
    api.recipeBooks.getRecipeBooks,
    {},
    { token }
  );

  return (
    <main className="page">
      <PageHeader
        title="Recipe books"
        icon="recipe_book"
        actionButton={
          <LinkButton title="New" icon="add" href="/app/new-recipe-book" />
        }
      />
      <main className="page-content">
        <RecipeBooks recipeBookListPreloaded={recipeBookListPreload} />
      </main>
    </main>
  );
};

export default App;
