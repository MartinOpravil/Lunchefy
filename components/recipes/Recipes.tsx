"use client";
import React from "react";
import NoContent from "../global/NoContent";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import { Doc } from "@/convex/_generated/dataModel";

interface RecipeBooksProps {
  recipes: Doc<"recipes">[];
  privilage: Privilage;
}

const RecipeBooks = ({ recipes, privilage }: RecipeBooksProps) => {
  if (!recipes) return <></>;

  return (
    <>
      {recipes.length === 0 ? (
        <>
          {privilage === Privilage.Viewer ? (
            <NoContent
              title="This book has no recipes yet"
              subTitle="Contact a responsible person to add some"
            />
          ) : (
            <NoContent
              title="This book has no recipes yet"
              subTitle="Start by creating one"
            />
          )}
        </>
      ) : (
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto gap-4">
          {recipes?.map((recipe) => (
            <Recipe
              key={recipe._id}
              id={recipe._id}
              recipeBookId={recipe.recipeBookId}
              title={recipe.name}
              description={recipe.description}
              imageUrl={recipe.coverImage?.imageUrl}
              privilage={privilage}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RecipeBooks;
