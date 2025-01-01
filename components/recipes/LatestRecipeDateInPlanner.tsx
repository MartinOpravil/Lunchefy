"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";

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

  const locale = useLocale() === "cs" ? "cs" : "en-GB";

  if (latestDate === undefined)
    return <LoaderCircle className="animate-spin text-primary !w-8 !h-8" />;
  if (!latestDate?.data) return <></>;

  return (
    <div className="text-text2 flex gap-2 items-center">
      <span className="hidden sm:block text-[14px]">{t("PlannedForDate")}</span>
      <h3 className="text-primary">
        {new Date(latestDate.data).toLocaleDateString(locale, {
          day: "numeric",
          month: "numeric",
        })}
      </h3>
    </div>
  );
};

export default LatestRecipeDateInPlanner;
