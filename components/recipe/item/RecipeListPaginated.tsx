"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { UsePaginatedQueryReturnType } from "convex/react";
import { Mouse } from "lucide-react";

import Recipe from "@/components/recipe/item/Recipe";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";

import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { Privilage } from "@/enums";
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

  const recipeListGroupedByPlannerDate = useMemo(() => {
    if (!groupByPlannerDate) return undefined;

    const label = (weekDiff: number) =>
      weekDiff === 0
        ? t("Planner.ThisWeek")
        : weekDiff === 1
          ? t("Planner.LastWeek")
          : t("Planner.XWeeksAgo", { week: weekDiff });

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
      {},
    );

    return groupedByWeek;
  }, [recipeListPaginated, groupByPlannerDate, t, MS_PER_WEEK, now]);

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
                  <div className="flex w-full items-center justify-start py-8">
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
              ),
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
            <div className="relative h-full w-full">
              <Skeleton className="h-full w-full bg-primary/30" />
              {!groupByPlannerDate && (
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 text-white-1">
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
