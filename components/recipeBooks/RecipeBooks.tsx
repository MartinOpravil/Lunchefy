"use client";
import React from "react";
import NoContent from "../global/NoContent";
import RecipeBook from "./RecipeBook";
import { getRecipeBooks } from "@/convex/recipeBooks";

const RecipeBooks = (props: {
  recipeBooks: Awaited<ReturnType<typeof getRecipeBooks>>;
}) => {
  return props.recipeBooks.data ? (
    <>
      {props.recipeBooks.data.length === 0 ? (
        <NoContent
          title="You have no recipe book yet"
          subTitle="Start by creating one"
        />
      ) : (
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto gap-4">
          {props.recipeBooks.data?.map((recipeBook) => (
            <RecipeBook
              key={recipeBook._id}
              id={recipeBook._id}
              title={recipeBook.name}
              description={recipeBook.description}
              imageUrl={recipeBook.coverImage?.imageUrl}
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
