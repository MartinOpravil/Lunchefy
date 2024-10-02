"use client";
import PageHeader from "@/components/global/PageHeader";
import { api } from "@/convex/_generated/api";
import React, { useState } from "react";
import RecipeBooks from "@/components/recipeBooks/RecipeBooks";
import { Preloaded, usePreloadedQuery } from "convex/react";
import ActionButton from "@/components/global/ActionButton";
import NewRecipeBookForm from "@/components/recipeBooks/NewRecipeBookForm";
import { ArrowLeft, Plus } from "lucide-react";
import { ButtonVariant } from "@/enums";

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
              icon={<ArrowLeft />}
              onClick={() => setIsNewFormOpen(false)}
              variant={ButtonVariant.Dark}
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
            icon={<Plus />}
            onClick={() => setIsNewFormOpen(true)}
            variant={ButtonVariant.Positive}
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
