"use client";
import ErrorHandler from "@/components/global/ErrorHandler";
import UpdateRecipeForm from "@/components/recipes/Form/UpdateRecipeForm";
import RecipeHeader from "@/components/recipes/RecipeHeader";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Image from "next/image";
import React from "react";

interface RecipePageProps {
  recipePreloaded: Preloaded<typeof api.recipes.getRecipeById>;
}

const RecipePage = ({ recipePreloaded }: RecipePageProps) => {
  const recipe = usePreloadedQuery(recipePreloaded);

  const formatTextWithHTML = (text?: string) => {
    if (!text) return { __html: "" };
    return { __html: text.replace(/\n/g, "<br />") };
  };

  return (
    <main className="page">
      <RecipeHeader recipe={recipe} />
      <main className="page-content">
        <ErrorHandler convexResponse={recipe} />
        {recipe.data && (
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <div className="w-full md:w-[50%] md:order-2 flex justify-center md:justify-end">
                {recipe.data.image?.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src={recipe.data.image?.imageUrl}
                      alt="recipe image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-[100%] h-[100%] max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="w-full md:w-[50%] flex flex-col gap-2">
                <h2>Ingredients:</h2>
                <p
                  dangerouslySetInnerHTML={formatTextWithHTML(
                    recipe.data.ingredients
                  )}
                ></p>
              </div>
            </div>
            <h2>Recipe:</h2>
            <p>{recipe.data.recipe}</p>
          </div>
        )}
      </main>
    </main>
  );
};

export default RecipePage;