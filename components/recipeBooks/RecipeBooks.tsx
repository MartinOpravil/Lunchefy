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
        <div className="recipe-grid">
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
