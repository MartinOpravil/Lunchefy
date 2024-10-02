"use client";
import ActionButton from "@/components/global/ActionButton";
import ErrorHandler from "@/components/global/ErrorHandler";
import LinkButton from "@/components/global/LinkButton";
import PageHeader from "@/components/global/PageHeader";
import NewRecipeForm from "@/components/recipes/Form/NewRecipeForm";
import Recipes from "@/components/recipes/Recipes";
import { api } from "@/convex/_generated/api";
import { ButtonVariant, Privilage } from "@/enums";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
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
              icon={<ArrowLeft />}
              onClick={() => setIsNewFormOpen(false)}
              variant={ButtonVariant.Dark}
            />
          }
        />
        <main className="page-content">
          <NewRecipeForm
            recipeBookId={recipeBook.data._id}
            afterSaveAction={() => setIsNewFormOpen(false)}
          />
        </main>
      </main>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title={recipeBook.data.name}
        icon="recipe_book"
        description={recipeBook.data.description}
        actionButton={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href="/app"
              variant={ButtonVariant.Dark}
            />
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            <LinkButton
              icon={<Pencil />}
              href={`/app/${recipeBook.data._id}/detail`}
            />
            {recipeBook.data.privilage !== Privilage.Viewer && (
              <>
                <ActionButton
                  title="New"
                  icon={<Plus />}
                  onClick={() => setIsNewFormOpen(true)}
                  variant={ButtonVariant.Positive}
                />
              </>
            )}
          </>
        }
      />
      <main className="page-content">
        <ErrorHandler convexResponse={recipeBook} />
        <Recipes recipes={recipes} />
      </main>
    </main>
  );
};

export default RecipeBookPage;
