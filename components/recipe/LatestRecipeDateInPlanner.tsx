"use client";

import { useTranslations } from "next-intl";

import { Doc } from "@/convex/_generated/dataModel";

import { useTimeLocale } from "@/hooks/useTimeLocale";

interface LatestRecipeDateInPlannerProps {
  recipe: Doc<"recipes">;
}

const LatestRecipeDateInPlanner = ({
  recipe,
}: LatestRecipeDateInPlannerProps) => {
  const t = useTranslations("Groups.Planner");

  const locale = useTimeLocale();

  if (!recipe.plannerDate) return <></>;

  return (
    <div className="flex items-center gap-2 text-text2">
      <span className="hidden text-[14px] sm:block">{t("PlannedForDate")}</span>
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
