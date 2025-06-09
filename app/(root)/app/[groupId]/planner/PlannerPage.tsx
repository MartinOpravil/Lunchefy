"use client";

import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache";
import { Preloaded, usePreloadedQuery } from "convex/react";

import PlannerCalendar from "@/components/planner/PlannerCalendar";
import PlannerPopupManager from "@/components/planner/PlannerPopupManager";
import SelectedDayOverview from "@/components/planner/SelectedDayOverview";
import ThisMonthRecipeList from "@/components/planner/ThisMonthRecipeList";
import PlannerHeader from "@/components/planner/header/PlannerHeader";

import { RecipePlannerAction } from "@/enums";
import { convertToServerTime, getCleanDate, getISOMonth } from "@/lib/time";
import { Plan, PlannerAction } from "@/types";

interface PlannerPageProps {
  groupPreloaded: Preloaded<typeof api.groups.getGroupById>;
  recipeListForMonthPreloaded: Preloaded<
    typeof api.planner.getGroupRecipeListForMonth
  >;
}

const PlannerPage = ({
  groupPreloaded,
  recipeListForMonthPreloaded,
}: PlannerPageProps) => {
  const initialISOMonth = getISOMonth(new Date());

  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipeListForMonth = usePreloadedQuery(
    recipeListForMonthPreloaded,
  );

  const [popupAction, setPopupAction] = useState<PlannerAction | null>(null);

  const [selectedISOMonth, setSelectedISOMonth] = useState(initialISOMonth);
  const recipeListForMonth = useQuery(api.planner.getGroupRecipeListForMonth, {
    groupId: group.data!._id,
    month: selectedISOMonth,
  });

  const today = getCleanDate(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedPlanList, setSelectedPlanList] = useState<Plan[] | undefined>(
    initialRecipeListForMonth.data?.filter(
      (day) => day.date === convertToServerTime(today),
    ),
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(
    selectedPlanList ? selectedPlanList[0] : undefined,
  );
  const [planList, setPlanList] = useState(initialRecipeListForMonth.data);

  useEffect(() => {
    if (!selectedDate) return;
    const updatedSelectedPlanList = planList?.filter(
      (day) => day.date === convertToServerTime(selectedDate),
    );
    if (updatedSelectedPlanList) {
      setSelectedPlanList(updatedSelectedPlanList);
      setSelectedPlan(updatedSelectedPlanList[0]);
      return;
    }
    setSelectedPlanList(undefined);
    setSelectedPlan(undefined);
  }, [selectedDate, planList]);

  useEffect(() => {
    if (recipeListForMonth?.data) {
      setPlanList(recipeListForMonth.data);
    }
  }, [recipeListForMonth]);

  if (!group.data) {
    return <></>;
  }

  return (
    <main className="page page-width-normal pb-8">
      <PlannerHeader
        group={group}
        assignAction={() =>
          setPopupAction({
            type: RecipePlannerAction.Assign,
            group,
            plan: selectedPlan,
          })
        }
      />
      <section className="page-content">
        <div className="relative flex min-h-[450px] w-full flex-col gap-8 sm:flex-row">
          <div className="flex flex-col items-center gap-8">
            <PlannerCalendar
              groupId={group.data._id}
              initialPlanList={initialRecipeListForMonth.data ?? undefined}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onMonthChange={(newDate: Date) =>
                setSelectedISOMonth(getISOMonth(newDate))
              }
            />
          </div>
          <SelectedDayOverview
            date={selectedDate}
            planList={selectedPlanList}
            group={group}
            action={setPopupAction}
          />
        </div>
        <ThisMonthRecipeList
          activeDate={selectedDate && convertToServerTime(selectedDate)}
          planList={planList}
          clasList="pt-8"
          onItemClick={(date) => setSelectedDate(new Date(date))}
        />
      </section>
      <PlannerPopupManager action={popupAction} date={selectedDate} />
    </main>
  );
};

export default PlannerPage;
