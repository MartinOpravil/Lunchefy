"use client";
import { CalendarFold } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";
import LoaderSpinner from "../global/LoaderSpinner";

interface PlannerButtonProps {
  groupId: string;
  todayRecipeName?: string;
  todayRecipeCount?: number;
}

const PlannerButton = ({
  groupId,
  todayRecipeName,
  todayRecipeCount,
}: PlannerButtonProps) => {
  const t = useTranslations();

  const [isRouting, setIsRouting] = useState(false);

  const visualizeRouting = () => {
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
    }, 5000);
  };

  return (
    <Link
      className="flex gap-2 items-center outline outline-1 outline-accent rounded-lg hover:outline-primary transition-all"
      href={`/app/${groupId}/planner`}
      onClick={visualizeRouting}
    >
      {isRouting ? (
        <div className="relative w-8 h-8 text-primary my-2 ml-2">
          <LoaderSpinner />
        </div>
      ) : (
        <CalendarFold className="!w-8 !h-8 text-primary my-2 ml-2" />
      )}
      <div className="pr-2">
        <div className="text-12 text-text">
          {t("Groups.Planner.Button.Today")}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-primary text-[18px]">
            {todayRecipeCount
              ? todayRecipeName
              : t("Groups.Planner.TodayNoRecipe")}
          </span>
        </div>
      </div>
      {(todayRecipeCount ?? 0) > 1 && (
        <div className="p-1.5 rounded-full bg-primary flex justify-center items-center text-14 text-white-1 mr-2 w-8 h-8">
          {`+${todayRecipeCount! - 1}`}
        </div>
      )}
    </Link>
  );
};

export default PlannerButton;
