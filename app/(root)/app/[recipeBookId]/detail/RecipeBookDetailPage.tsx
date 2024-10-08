"use client";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeBookDetailForm from "@/components/recipeBooks/Detail/RecipeBookDetailForm";
import RecipeBookDetailPageHeader from "@/components/recipeBooks/Detail/RecipeBookDetailPageHeader";
import { api } from "@/convex/_generated/api";
import { FormMethods } from "@/types";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React, { useRef } from "react";

const RecipeBookDetailPage = (props: {
  recipeBookPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBookById>;
}) => {
  const recipeBook = usePreloadedQuery(props.recipeBookPreloaded);
  const formRef = useRef<FormMethods>(null);

  return (
    <main className="page">
      <RecipeBookDetailPageHeader recipeBook={recipeBook} formRef={formRef} />
      <main className="page-content">
        <ErrorHandler convexResponse={recipeBook} />
        <RecipeBookDetailForm recipeBook={recipeBook} ref={formRef} />
      </main>
    </main>
  );
};

export default RecipeBookDetailPage;
