"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Doc } from "@/convex/_generated/dataModel";

interface LatestRecipeDateInPlannerProps {
  recipe: Doc<"recipes">;
}

const LatestRecipeDateInPlanner = ({
  recipe,
}: LatestRecipeDateInPlannerProps) => {
  const t = useTranslations("Groups.Planner");

  const locale = useLocale() === "cs" ? "cs" : "en-GB";

  if (!recipe.plannerDate) return <></>;

  return (
    <div className="text-text2 flex gap-2 items-center">
      <span className="hidden sm:block text-[14px]">{t("PlannedForDate")}</span>
      <h3 className="text-primary">
        {new Date(recipe.plannerDate).toLocaleDateString(locale, {
          day: "numeric",
          month: "numeric",
        })}
      </h3>
    </div>
  );
};

export default LatestRecipeDateInPlanner;
