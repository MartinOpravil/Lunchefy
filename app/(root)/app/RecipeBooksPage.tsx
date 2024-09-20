"use client";
import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import React, { useState } from "react";
import RecipeBooks from "@/components/recipeBooks/RecipeBooks";
import { Preloaded, usePreloadedQuery } from "convex/react";
import ActionButton from "@/components/global/ActionButton";
import NewRecipeBookForm from "@/components/recipeBooks/NewRecipeBookForm";

const RecipeBooksPage = (props: {
  recipeBooksPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBooks>;
}) => {
  const recipeBooks = usePreloadedQuery(props.recipeBooksPreloaded);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  // New Form
  if (isNewFormOpen) {
    return (
      <main className="page">
        <PageHeader
          title="New recipe book"
          icon="recipe_book"
          actionButton={
            <ActionButton
              title="Back"
              icon="back"
              onClick={() => setIsNewFormOpen(false)}
              classList="!bg-gray-700 hover:!bg-secondary"
            />
          }
        />
        <main className="page-content">
          <NewRecipeBookForm afterSaveAction={() => setIsNewFormOpen(false)} />
        </main>
      </main>
    );
  }

  // Overview
  return (
    <main className="page">
      <PageHeader
        title="Recipe books"
        icon="recipe_book"
        actionButton={
          <ActionButton
            title="New"
            icon="add"
            onClick={() => setIsNewFormOpen(true)}
            classList="!bg-primary hover:!bg-primaryTransparent"
          />
        }
      />
      <main className="page-content">
        <RecipeBooks recipeBooks={recipeBooks} />
      </main>
    </main>
  );
};

export default RecipeBooksPage;
