"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { CalendarFold } from "lucide-react";

import LoaderSpinner from "@/components/global/content/LoaderSpinner";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { useProgressSwitch } from "@/hooks/useProgressSwitch";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";

interface PlannerButtonProps {
  groupId: string;
}

const PROGRESS_SWITCH_DURATION_MS = 5000;

const PlannerButton = ({ groupId }: PlannerButtonProps) => {
  const t = useTranslations();
  const { todayRecipeList, isFetched } = useGroupStore();
  const { progress, text, isVisible } = useProgressSwitch({
    duration: PROGRESS_SWITCH_DURATION_MS,
    textList: todayRecipeList?.map((x) => x.name) ?? [],
  });

  const [isRouting, setIsRouting] = useState(false);

  const visualizeRouting = () => {
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
    }, 5000);
  };

  return (
    <Link
      className="relative flex items-center gap-2 rounded-lg outline outline-1 outline-accent transition-all hover:outline-primary"
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
        <div className="text-12 flex items-center gap-2 text-text">
          {t("Groups.Planner.Button.Today")}
          {(todayRecipeList?.length ?? 0) > 1 && (
            <Progress value={progress} className="w-full" />
          )}
        </div>
        <div className="relative flex items-center gap-2">
          {isFetched ? (
            <span
              className={cn(
                "text-[18px] text-primary transition-opacity duration-500",
                isVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {text ?? t("Groups.Planner.TodayNoRecipe")}
            </span>
          ) : (
            <Skeleton className="mt-1 h-4 w-32 bg-primary/30" />
          )}
        </div>
      </div>
      {(todayRecipeList?.length ?? 0) > 1 && (
        <>
          <div className="text-14 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1.5 text-white-1">
            {`+${todayRecipeList?.length! - 1}`}
          </div>
        </>
      )}
    </Link>
  );
};

export default PlannerButton;
