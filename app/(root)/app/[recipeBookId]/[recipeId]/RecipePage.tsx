"use client";
import ErrorHandler from "@/components/global/ErrorHandler";
import RecipeForm from "@/components/recipes/Form/RecipeForm";
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

  if (!recipe.data) {
    return <></>;
  }

  return (
    <main className="page">
      <RecipeHeader recipe={recipe} />
      <main className="page-content">
        <ErrorHandler convexResponse={recipe} />

        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 w-full">
            {recipe.data.coverImage?.imageUrl && (
              <div className="flex md:order-2 w-full">
                <div className="bg-primary/20 p-2 rounded-lg overflow-hidden max-h-[400px] w-full">
                  <Image
                    src={recipe.data.coverImage?.imageUrl}
                    alt="recipe image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-[100%] h-[100%] object-contain"
                  />
                </div>
              </div>
            )}
            {recipe.data.isImageRecipe ? (
              <>
                {recipe.data.recipeImage?.imageUrl && (
                  <div className="flex rounded-lg overflow-hidden max-h-[900px]">
                    <Image
                      src={recipe.data.recipeImage?.imageUrl}
                      alt="recipe image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-[100%] h-[100%]"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="w-full md:w-[50%] flex flex-col gap-2">
                <h2>Ingredients:</h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: recipe.data.ingredients ?? "",
                  }}
                ></div>
              </div>
            )}
          </div>
          {!recipe.data.isImageRecipe && (
            <>
              <h2>Instructions:</h2>
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                <div
                  className="prose w-full max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: recipe.data.instructions ?? "",
                  }}
                ></div>
                <div className="w-full md:w-[50%] md:order-2 flex justify-center md:justify-end">
                  {recipe.data.recipeImage?.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src={recipe.data.recipeImage?.imageUrl}
                        alt="recipe image"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-[100%] h-[100%] max-h-[400px] object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </main>
  );
};

export default RecipePage;
