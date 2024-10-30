"use client";
import React from "react";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import InfiniteScroll from "../ui/infinite-scroll";
import { Mouse } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UsePaginatedQueryReturnType } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RECIPES_NEXT_COUNT } from "@/constants/pagination";

interface RecipeBooksProps {
  recipesPaginated: UsePaginatedQueryReturnType<typeof api.recipes.getRecipes>;
  privilage: Privilage;
}

const RecipeBooks = ({ recipesPaginated, privilage }: RecipeBooksProps) => {
  return (
    <>
      <div className="recipe-grid">
        {recipesPaginated.results?.map((recipe) => (
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
          hasMore={recipesPaginated.status === "CanLoadMore"}
          isLoading={recipesPaginated.isLoading ?? false}
          next={() => recipesPaginated.loadMore(RECIPES_NEXT_COUNT)}
          threshold={1}
        >
          {recipesPaginated.status !== "Exhausted" && (
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
