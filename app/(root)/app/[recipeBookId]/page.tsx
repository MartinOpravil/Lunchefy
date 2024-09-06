import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import React from "react";

const RecipeBookPage = () => {
  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <PageHeader
        title="Recipes"
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            <LinkButton title="New" icon="add" href="/app/new-recipe-book" />
          </>
        }
      />
      <main className="relative h-full flex flex-col items-center justify-start py-8"></main>
    </main>
  );
};

export default RecipeBookPage;
