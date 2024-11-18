import React from "react";
import { isSameDay } from "date-fns";
import ErrorHandlerPreloaded from "@/components/global/ErrorHandlerPreloaded";
import { Id } from "@/convex/_generated/dataModel";
import PlannerPage from "./PlannerPage";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

interface PlannerServerPageProps {
  params: { groupId: Id<"groups"> };
}

const PlannerServerPage = async ({
  params: { groupId },
}: PlannerServerPageProps) => {
  const month = new Date().toISOString().slice(0, 7);

  const token = await getAuthToken();
  const groupPreloadPromise = preloadQuery(
    api.groups.getGroupById,
    {
      id: groupId,
    },
    { token }
  );
  const recipeListForMonthPreloadPromise = preloadQuery(
    api.planner.getGroupRecipeListForMonth,
    {
      groupId,
      month,
    },
    { token }
  );

  const [groupPreload, recipeListForMonthPreload] = await Promise.all([
    groupPreloadPromise,
    recipeListForMonthPreloadPromise,
  ]);

  return (
    <>
      <ErrorHandlerPreloaded preloadedData={groupPreload} />
      <PlannerPage
        groupPreloaded={groupPreload}
        recipeListForMonthPreloaded={recipeListForMonthPreload}
      />
    </>
  );
};

export default PlannerServerPage;
