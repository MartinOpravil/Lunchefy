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
  const t = useTranslations("Recipes");

  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const label = (weekDiff: number) =>
    weekDiff === 0
      ? t("Planner.ThisWeek")
      : weekDiff === 1
        ? t("Planner.LastWeek")
        : t("Planner.XWeeksAgo", { week: weekDiff });

  const recipeListGroupedByPlannerDate = useMemo(() => {
    if (!groupByPlannerDate) return undefined;

    const groupedByWeek = recipeListPaginated.results.reduce<GroupedRecipes>(
      (acc, recipe) => {
        let key = "";
        if (!recipe.plannerDate) {
          key = t("Planner.NotYetPlanned");
        } else {
          const diffInMs = now - recipe.plannerDate;
          const weekDiff = Math.floor(diffInMs / MS_PER_WEEK);

          key = label(weekDiff);
        }

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(recipe);
        return acc;
      },
      {}
    );

    return groupedByWeek;
  }, [recipeListPaginated, groupByPlannerDate, t]);

  return (
    <>
      <div
        className={cn("flex flex-col gap-8", {
          "recipe-grid": !groupByPlannerDate,
        })}
      >
        {recipeListGroupedByPlannerDate ? (
          <>
            {Object.entries(recipeListGroupedByPlannerDate).map(
              ([month, recipes]: [string, Doc<"recipes">[]]) => (
                <div key={month}>
                  <div className="flex w-full py-8 items-center justify-start">
                    <h3 className="opacity-70">{month}</h3>
                  </div>
                  <div className="recipe-grid">
                    {recipes?.map((recipe) => (
                      <Recipe
                        key={recipe._id}
                        recipe={recipe}
                        privilage={privilage}
                        showTags={showTags}
                      />
                    ))}
                  </div>
                </div>
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
              {!groupByPlannerDate && (
                <div className="absolute top-0 left-0 w-full h-full text-white-1 flex flex-col justify-center items-center gap-2">
                  <Mouse />
                  <div className="text-center">
                    {t("Scroll.Top")}
                    <h3 className="text-white-1">{t("Scroll.Bottom")}</h3>
                  </div>
                </div>
              )}
            </div>
          )}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default RecipeListPaginated;
