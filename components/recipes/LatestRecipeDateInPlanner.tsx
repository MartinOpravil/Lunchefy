import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

interface LatestRecipeDateInPlannerProps {
  groupId: string;
  recipeId: string;
}

const LatestRecipeDateInPlanner = ({
  groupId,
  recipeId,
}: LatestRecipeDateInPlannerProps) => {
  const t = useTranslations("Groups.Planner");
  const latestDate = useQuery(api.planner.getLatestRecipePlanDate, {
    groupId,
    recipeId,
  });

  if (latestDate === undefined)
    return (
      <Skeleton className="w-16 sm:w-[160px] h-8 bg-primary/20 rounded-xl" />
    );
  if (!latestDate?.data) return <></>;

  return (
    <div className="text-text2 flex gap-2 items-center">
      <span className="hidden sm:block text-[14px]">{t("PlannedForDate")}</span>
      <h3 className="text-primary">
        {new Date(latestDate.data).toLocaleDateString("cs", {
          day: "numeric",
          month: "numeric",
        })}
      </h3>
    </div>
  );
};

export default LatestRecipeDateInPlanner;
