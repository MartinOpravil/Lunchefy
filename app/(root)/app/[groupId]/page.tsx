import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import GroupPage from "./GroupPage";
import ErrorHandlerPreloaded from "@/components/global/ErrorHandlerPreloaded";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";

interface GroupServerPageProps {
  params: { groupId: Id<"groups"> };
}

const GroupServerPage = async ({
  params: { groupId },
}: GroupServerPageProps) => {
  const token = await getAuthToken();
  const groupPreloadPromise = preloadQuery(
    api.groups.getGroupById,
    {
      id: groupId,
    },
    { token }
  );
  const recipesPreloadPromise = preloadQuery(
    api.recipes.getRecipes,
    {
      groupId,
      paginationOpts: {
        numItems: RECIPES_INITIAL_COUNT,
        cursor: null,
      },
    },
    { token }
  );
  const todayRecipePreloadPromise = preloadQuery(
    api.planner.getTodayRecipe,
    {
      groupId,
    },
    { token }
  );

  const [groupPreload, recipesPreload, todayRecipePreload] = await Promise.all([
    groupPreloadPromise,
    recipesPreloadPromise,
    todayRecipePreloadPromise,
  ]);

  return (
    <>
      <ErrorHandlerPreloaded preloadedData={groupPreload} />
      <GroupPage
        groupPreloaded={groupPreload}
        recipesPreloaded={recipesPreload}
        todayRecipePreload={todayRecipePreload}
      />
    </>
  );
};

export default GroupServerPage;
