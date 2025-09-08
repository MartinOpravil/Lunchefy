import React, { useMemo } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { UsePaginatedQueryReturnType } from "convex/react";

import Recipe from "@/components/recipe/item/Recipe";
import RecipePlannerSkeleton from "@/components/recipe/item/skeleton/RecipePlannerSkeleton";
import InfiniteScroll from "@/components/ui/infinite-scroll";

import { RECIPES_NEXT_COUNT } from "@/constants/pagination";
import { Privilage } from "@/enums";

interface PlannerRecipeListPaginatedProps {
  recipeListPaginated: UsePaginatedQueryReturnType<
    typeof api.recipes.getRecipes
  >;
  privilage: Privilage;
  showTags?: boolean;
}

type GroupedRecipes = Record<string, Doc<"recipes">[]>;

const PlannerRecipeListPaginated = ({
  recipeListPaginated,
  privilage,
  showTags,
}: PlannerRecipeListPaginatedProps) => {
  const t = useTranslations("Recipes");

  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const recipeListGroupedByPlannerDate = useMemo(() => {
    const label = (weekDiff: number) => {
      if (weekDiff < 0) return t("Planner.Future");
      if (weekDiff === 0) return t("Planner.ThisWeek");
      if (weekDiff === 1) return t("Planner.LastWeek");

      return t("Planner.XWeeksAgo", { week: weekDiff });
    };

    const groupedRecipesByWeek =
      recipeListPaginated.results.reduce<GroupedRecipes>((acc, recipe) => {
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
      }, {});

    return groupedRecipesByWeek;
  }, [recipeListPaginated, t, MS_PER_WEEK, now]);

  return (
    <div className="flex flex-col gap-8">
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
      <InfiniteScroll
        hasMore={recipeListPaginated.status === "CanLoadMore"}
        isLoading={recipeListPaginated.isLoading ?? false}
        next={() => recipeListPaginated.loadMore(RECIPES_NEXT_COUNT)}
        threshold={1}
      >
        <div>
          {recipeListPaginated.status !== "Exhausted" && (
            <RecipePlannerSkeleton />
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default PlannerRecipeListPaginated;
