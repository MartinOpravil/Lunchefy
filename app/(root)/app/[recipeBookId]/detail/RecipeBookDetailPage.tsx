"use client";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeBookDetailForm from "@/components/recipeBooks/Detail/RecipeBookDetailForm";
import RecipeBookDetailPageHeader from "@/components/recipeBooks/Detail/RecipeBookDetailPageHeader";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";

const RecipeBookDetailPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);

  return (
    <main className="page">
      <RecipeBookDetailPageHeader recipeBook={recipeBook} />
      <main className="page-content">
        <ErrorHandler preloadedData={props.recipeBookPreloaded} />
        <RecipeBookDetailForm recipeBook={recipeBook} />
      </main>
    </main>
  );
};

export default RecipeBookDetailPage;
