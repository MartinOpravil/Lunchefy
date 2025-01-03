import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import PlannerPage from "./PlannerPage";
import { getAuthToken } from "@/lib/authentication";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ContentHandler from "@/components/global/ContentHandler";
import { getISOMonth } from "@/lib/time";

interface PlannerServerPageProps {
  params: Promise<{ groupId: Id<"groups"> }>;
}

const PlannerServerPage = async ({ params }: PlannerServerPageProps) => {
  const groupId = (await params).groupId;

  const month = getISOMonth(new Date());

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
    <ContentHandler preloadedData={groupPreload}>
      <PlannerPage
        groupPreloaded={groupPreload}
        recipeListForMonthPreloaded={recipeListForMonthPreload}
      />
    </ContentHandler>
  );
};

export default PlannerServerPage;
