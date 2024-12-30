import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import GroupPage from "./GroupPage";
import { RECIPES_INITIAL_COUNT } from "@/constants/pagination";
import { GenericId } from "convex/values";
import ContentHandler from "@/components/global/ContentHandler";

interface GroupServerPageProps {
  params: Promise<{ groupId: GenericId<"groups"> }>;
}

const GroupServerPage = async ({ params }: GroupServerPageProps) => {
  const groupId = (await params).groupId;
  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const groupPreloadPromise = preloadQuery(
    api.groups.getGroupById,
    {
      id: groupId,
      checkPrivilages: false,
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

  const [userPreload, groupPreload, recipesPreload, todayRecipePreload] =
    await Promise.all([
      userPreloadPromise,
      groupPreloadPromise,
      recipesPreloadPromise,
      todayRecipePreloadPromise,
    ]);

  return (
    <ContentHandler preloadedData={groupPreload}>
      <GroupPage
        userPreloaded={userPreload}
        groupPreloaded={groupPreload}
        recipesPreloaded={recipesPreload}
        todayRecipePreload={todayRecipePreload}
      />
    </ContentHandler>
  );
};

export default GroupServerPage;
