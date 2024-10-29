"use client";
import React, { useState } from "react";
import NoContent from "../global/NoContent";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import { Doc, Id } from "@/convex/_generated/dataModel";
import InfiniteScroll from "../ui/infinite-scroll";
import { getRecipes } from "@/convex/recipes";
import { Loader2, Mouse } from "lucide-react";
import { getNextRecipePage } from "@/lib/pagination";
import { Skeleton } from "../ui/skeleton";

interface RecipeBooksProps {
  initialRecipes: Awaited<ReturnType<typeof getRecipes>>;
  recipeBookId: Id<"recipeBooks">;
  searchTerm?: string;
  privilage: Privilage;
}

const RecipeBooks = ({
  initialRecipes,
  recipeBookId,
  searchTerm,
  privilage,
}: RecipeBooksProps) => {
  const [recipes, setRecipes] = useState(initialRecipes.page);
  const [isDone, setIsDone] = useState(initialRecipes.isDone);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [continuationToken, setContinuationToken] = useState(
    initialRecipes.continueCursor
  );

  const loadMore = async () => {
    console.log("triggered...");
    setIsLoadingMore(true);
    const result = await getNextRecipePage(
      recipeBookId,
      continuationToken,
      searchTerm
    );
    setContinuationToken(result.continueCursor);
    setRecipes([...recipes, ...result.results]);
    setIsDone(result.isDone);
    setIsLoadingMore(false);
  };

  return (
    <>
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
        <InfiniteScroll
          hasMore={!isDone}
          isLoading={isLoadingMore}
          next={loadMore}
          threshold={1}
        >
          {!isDone && (
            <div className="h-full w-full relative">
              <Skeleton className="h-full w-full bg-accent/70" />
              <div className="absolute top-0 left-0 w-full h-full text-white-1 flex flex-col justify-center items-center gap-2">
                <Mouse />
                <div className="text-center">
                  Scroll down to
                  <h3>Load more</h3>
                </div>
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default RecipeBooks;
