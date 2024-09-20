"use client";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import Recipes from "@/components/recipes/Recipes";
import { api } from "@/convex/_generated/api";
import { Privilage } from "@/enums";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React, { useState } from "react";

const RecipeBookPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
  recipesPreloaded: Preloaded<typeof api.recipes.getRecipes>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const recipes = usePreloadedQuery(props.recipesPreloaded);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  if (!recipeBook.data) {
    return <></>;
  }

  if (isNewFormOpen) {
    return (
      <main className="page">
        <PageHeader
          title="New recipe"
          icon="recipe"
          actionButton={
            <ActionButton
              title="Back"
              icon="back"
              onClick={() => setIsNewFormOpen(false)}
            />
          }
        />
        <main className="page-content">{recipeBook.data.name}</main>
      </main>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title={`${recipeBook.data.name}`}
        icon="recipe_book"
        actionButton={
          <>
            <LinkButton title="Back" icon="back" href="/app" />
            {recipeBook.data.privilage !== Privilage.Viewer && (
              <>
                <ActionButton
                  title="New"
                  icon="add"
                  onClick={() => setIsNewFormOpen(true)}
                />
              </>
            )}
          </>
        }
      />
      <main className="page-content">
        <ErrorHandler preloadedData={props.recipeBookPreloaded} />
        <Recipes recipes={recipes} />
      </main>
    </main>
  );
};

export default RecipeBookPage;
