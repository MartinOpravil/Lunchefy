"use client";
import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import LoaderSpiner from "@/components/global/LoaderSpinner";
import NoContent from "@/components/global/NoContent";
import PageHeader from "@/components/global/PageHeader";
import RecipeBook from "@/components/RecipeBook";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useState } from "react";

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const recipeBookList = useQuery(api.recipeBooks.getRecipeBooks);

  return (
    <main className="flex flex-col py-6 h-[calc(100vh-72.4px)]">
      <PageHeader
        title="Recipe books"
        icon="recipe_book"
        actionButton={
          <LinkButton title="New" icon="add" href="/app/new-recipe-book" />
        }
      />
      <main className="relative h-full flex flex-col items-center justify-start py-8">
        {recipeBookList ? (
          <>
            {recipeBookList.length === 0 ? (
              <NoContent
                title="You have no recipe book yet"
                subTitle="Start by creating one"
              />
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-auto gap-4">
                {recipeBookList?.map((recipeBook) => (
                  <RecipeBook
                    key={recipeBook._id}
                    id={recipeBook._id}
                    title={recipeBook.name}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full">
            <LoaderSpiner />
          </div>
        )}
        {isFetching ? <LoaderSpiner /> : <></>}
      </main>
    </main>
  );
};

export default App;
