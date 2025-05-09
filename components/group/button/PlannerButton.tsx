"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { CalendarFold } from "lucide-react";

import LoaderSpinner from "@/components/global/content/LoaderSpinner";

import { useGroupStore } from "@/store/group";

interface PlannerButtonProps {
  groupId: string;
}

const PlannerButton = ({ groupId }: PlannerButtonProps) => {
  const t = useTranslations();
  const { todayRecipeList, getTodayRecipe } = useGroupStore();

  const [isRouting, setIsRouting] = useState(false);

  const visualizeRouting = () => {
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
    }, 5000);
  };

  return (
    <Link
      className="flex items-center gap-2 rounded-lg outline outline-1 outline-accent transition-all hover:outline-primary"
      href={`/app/${groupId}/planner`}
      onClick={visualizeRouting}
    >
      {isRouting ? (
        <div className="relative my-2 ml-2 h-8 w-8 text-primary">
          <LoaderSpinner />
        </div>
      ) : (
        <CalendarFold className="my-2 ml-2 !h-8 !w-8 text-primary" />
      )}
      <div className="pr-2">
        <div className="text-12 text-text">
          {t("Groups.Planner.Button.Today")}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[18px] text-primary">
            {getTodayRecipe()?.name ?? t("Groups.Planner.TodayNoRecipe")}
          </span>
        </div>
      </div>
      {(todayRecipeList?.length ?? 0) > 1 && (
        <div className="text-14 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1.5 text-white-1">
          {`+${todayRecipeList?.length! - 1}`}
        </div>
      )}
    </Link>
  );
};

export default PlannerButton;
