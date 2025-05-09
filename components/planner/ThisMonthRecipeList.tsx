import { useTranslations } from "next-intl";

import { Dot } from "lucide-react";

import { convertToClientTime } from "@/lib/time";
import { cn, getTimeLocale } from "@/lib/utils";
import { Plan } from "@/types";

interface ThisMonthRecipeListProps {
  activeDate?: string;
  planList: Plan[] | null;
  clasList?: string;
  onItemClick: (date: string) => void;
}

const ThisMonthRecipeList = ({
  activeDate,
  planList,
  clasList,
  onItemClick,
}: ThisMonthRecipeListProps) => {
  const t = useTranslations();

  const locale = getTimeLocale();

  const getGroupedData = (planList: Plan[]) => {
    return Object.values(
      planList.reduce(
        (acc, item) => {
          if (!acc[item.date]) {
            acc[item.date] = { date: item.date, names: [] };
          }
          acc[item.date].names.push(item.recipe.name);
          return acc;
        },
        {} as Record<string, { date: string; names: string[] }>,
      ),
    ).sort((a, b) => (a.date > b.date ? 1 : -1));
  };

  return (
    <div className={cn("w-full @container", clasList)}>
      <h3 className="text-[20px] sm:text-[24px]">
        {t("Groups.Planner.RecipeListTitle")}
      </h3>
      <div className="columns-1 gap-4 pt-8 @sm:columns-2 @lg:columns-3 @2xl:columns-4">
        {planList &&
          getGroupedData(planList)?.map((plan, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "mb-4 flex cursor-pointer break-inside-avoid flex-col gap-3 rounded-lg px-2 py-4 outline outline-1 outline-accent transition-all hover:outline-primary",
                  {
                    "text-primary": activeDate === plan.date,
                  },
                )}
                onClick={() => onItemClick(plan.date)}
              >
                <div
                  className={cn("w-full text-center text-[18px] text-text2", {
                    "text-primary": activeDate === plan.date,
                  })}
                >
                  {convertToClientTime(plan.date).toLocaleString(locale, {
                    day: "numeric",
                  })}
                </div>
                <div className="heading-underline !my-0" />
                <div className="flex flex-col justify-between gap-2 text-[14px] sm:text-[16px]">
                  {plan.names.map((name, i) => (
                    <div key={i} className="flex items-center gap-1 text-text">
                      <Dot className="!h-6 !min-w-6" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ThisMonthRecipeList;
