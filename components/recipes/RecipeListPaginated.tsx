"use client";
import React, { useMemo } from "react";
import Recipe from "./Recipe";
import { Privilage } from "@/enums";
import InfiniteScroll from "../ui/infinite-scroll";
import { Mouse } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { UsePaginatedQueryReturnType } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { useTranslations } from "next-intl";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface RecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  privilage: Privilage;
  showTags?: boolean;
  groupByPlannerDate?: boolean;
}

type GroupedRecipes = Record<string, Doc<"recipes">[]>;

const RecipeListPaginated = ({
  recipeListPaginated,
  privilage,
  showTags = false,
  groupByPlannerDate = false,
}: RecipeListPaginatedProps) => {
  const t = useTranslations("Recipes.Scroll");

  const recipeListGroupedByPlannerDate = useMemo(() => {
    if (!groupByPlannerDate) return undefined;

    const groupedByMonth = recipeListPaginated.results.reduce<GroupedRecipes>(
      (acc, recipe) => {
        if (!recipe.plannerDate) return acc;
        const date = new Date(recipe.plannerDate);
        // const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const key = `${date?.toLocaleDateString("CS", { month: "long" })}`;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(recipe);
        return acc;
      },
      {}
    );

    return groupedByMonth;
  }, [recipeListPaginated, groupByPlannerDate]);

  return (
    <>
      <div className={cn({ "recipe-grid": !groupByPlannerDate })}>
        {/* {recipeListGroupedByPlannerDate ? (
          <>{Object.keys(recipeListGroupedByPlannerDate).length}</>
        ) : (
          <>"Nothing"</>
        )} */}
        {recipeListGroupedByPlannerDate ? (
          <>
            {Object.entries(recipeListGroupedByPlannerDate).map(
              ([month, recipes]: [string, Doc<"recipes">[]]) => (
                <>
                  <div
                    key={`${month}`}
                    className="flex w-full py-2 justify-center items-center"
                  >
                    {month}
                  </div>
                  <div key={`${month}-recipes`} className="recipe-grid">
                    {recipes?.map((recipe) => (
                      <Recipe
                        key={recipe._id}
                        recipe={recipe}
                        privilage={privilage}
                        showTags={showTags}
                      />
                    ))}
                  </div>
                </>
              )
            )}
          </>
        ) : (
          <>
            {recipeListPaginated.results?.map((recipe) => (
              <Recipe
                key={recipe._id}
                recipe={recipe}
                privilage={privilage}
                showTags={showTags}
              />
            ))}
          </>
        )}
        <InfiniteScroll
          hasMore={recipeListPaginated.status === "CanLoadMore"}
          isLoading={recipeListPaginated.isLoading ?? false}
          next={() => recipeListPaginated.loadMore(RECIPES_NEXT_COUNT)}
          threshold={1}
        >
          {recipeListPaginated.status !== "Exhausted" && (
            <div className="h-full w-full relative">
              <Skeleton className="h-full w-full bg-primary/30" />
              <div className="absolute top-0 left-0 w-full h-full text-white-1 flex flex-col justify-center items-center gap-2">
                <Mouse />
                <div className="text-center">
                  {t("Top")}
                  <h3 className="text-white-1">{t("Bottom")}</h3>
                </div>
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default RecipeListPaginated;
