"use client";
import React from "react";
import NoContent from "../global/NoContent";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import { getRecipes } from "@/convex/recipes";

const RecipeBooks = (props: {
  recipes: Awaited<ReturnType<typeof getRecipes>>;
}) => {
  if (!props.recipes.data) return <></>;

  return (
    <>
      {props.recipes.data.recipes.length === 0 ? (
        <>
          {props.recipes.data.privilage === Privilage.Viewer ? (
            <NoContent
              title="This recipe book does not have any recipes yet"
              subTitle="Contact a responsible person to add some"
            />
          ) : (
            <NoContent
              title="You have no recipe yet"
              subTitle="Start by creating one"
            />
          )}
        </>
      ) : (
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto gap-4">
          {props.recipes.data.recipes?.map((recipeBook) => (
            <Recipe
              key={recipeBook._id}
              id={recipeBook._id}
              title={recipeBook.name}
              description={recipeBook.description}
              imageUrl={recipeBook.image?.imageUrl}
              privilage={props.recipes.data!.privilage}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RecipeBooks;
