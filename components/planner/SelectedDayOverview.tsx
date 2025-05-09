import { useTranslations } from "next-intl";

import { getGroupById } from "@/convex/groups";
import { Pencil, Trash2 } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import Recipe from "@/components/recipe/item/Recipe";

import { Privilage, RecipePlannerAction } from "@/enums";
import { getTimeLocale } from "@/lib/utils";
import { Plan, PlannerAction } from "@/types";

interface SelectedDayOverviewProps {
  date?: Date;
  planList?: Plan[];
  group: Awaited<ReturnType<typeof getGroupById>>;
  action: React.Dispatch<React.SetStateAction<PlannerAction | null>>;
}

const SelectedDayOverview = ({
  date,
  planList,
  group,
  action,
}: SelectedDayOverviewProps) => {
  const t = useTranslations();
  const locale = getTimeLocale();

  return (
    <div className="flex w-full flex-col gap-8 @container">
      <span>
        <h2 className="capitalize">
          {date?.toLocaleDateString(locale, {
            weekday: "long",
          })}
        </h2>
        <span className="text-text2">{`(${date?.toLocaleDateString(locale)})`}</span>
      </span>
      {planList?.map((plan, index) => (
        <div key={index} className="flex w-full flex-col gap-2 @sm:flex-row">
          <Recipe
            recipe={plan.recipe}
            privilage={Privilage.Viewer}
            vertical
            useVerticalButton
            classList="w-full flex-shrink-0 @sm:flex-shrink"
          />
          <div className="flex h-full flex-shrink flex-row justify-end gap-2 @sm:flex-col @sm:justify-start">
            <ActionButton
              icon={<Pencil />}
              onClick={() => {
                action({
                  type: RecipePlannerAction.Swap,
                  group,
                  id: plan.recipe._id,
                  plan,
                });
              }}
            />
            <ActionButton
              icon={
                <Trash2 className="transition-all group-hover:text-primary" />
              }
              onClick={() => {
                action({
                  type: RecipePlannerAction.Remove,
                  id: plan.recipe._id,
                  plan,
                });
              }}
            />
          </div>
        </div>
      ))}
      {planList?.length === 0 && (
        <div className="text-[16px] italic text-text2 sm:text-[20px]">
          {t("Groups.Planner.SelectedDateNoRecipe")}
        </div>
      )}
    </div>
  );
};

export default SelectedDayOverview;
