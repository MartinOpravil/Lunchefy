"use client";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeDetailHeader from "@/components/recipes/Detail/RecipeDetailHeader";
import UpdateRecipeForm from "@/components/recipes/Form/UpdateRecipeForm";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";

interface RecipeDetailPageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipeDetailPage = ({ recipePreloaded }: RecipeDetailPageProps) => {
  const recipe = usePreloadedQuery(recipePreloaded);
  return (
    <main className="page">
      <RecipeDetailHeader recipe={recipe} />
      <main className="page-content">
        <ErrorHandler convexResponse={recipe} />
        <UpdateRecipeForm recipe={recipe} />
      </main>
    </main>
  );
};

export default RecipeDetailPage;
