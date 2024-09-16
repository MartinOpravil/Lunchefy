"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import NoContent from "../global/NoContent";
import RecipeBook from "./RecipeBook";

const RecipeBooks = (props: {
  recipeBookListPreloaded: Preloaded<typeof api.recipeBooks.getRecipeBooks>;
}) => {
  const recipeBookListResult = usePreloadedQuery(props.recipeBookListPreloaded);
  return recipeBookListResult.data ? (
    <>
      {recipeBookListResult.data.length === 0 ? (
        <NoContent
          title="You have no recipe book yet"
          subTitle="Start by creating one"
        />
      ) : (
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto gap-4">
          {recipeBookListResult.data?.map((recipeBook) => (
            <RecipeBook
              key={recipeBook._id}
              id={recipeBook._id}
              title={recipeBook.name}
              imageUrl={recipeBook.image?.imageUrl}
              privilage={recipeBook.privilage}
            />
          ))}
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default RecipeBooks;