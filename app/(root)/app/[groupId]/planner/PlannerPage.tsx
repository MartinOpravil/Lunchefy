"use client";

import { useEffect, useState } from "react";

import { useLocale } from "next-intl";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { isSameDay } from "date-fns";
import { cs, enUS } from "date-fns/locale";

import PlannerPopupManager from "@/components/planner/PlannerPopupManager";
import SelectedDayOverview from "@/components/planner/SelectedDayOverview";
import ThisMonthRecipeList from "@/components/planner/ThisMonthRecipeList";
import PlannerHeader from "@/components/planner/header/PlannerHeader";
import { Calendar } from "@/components/ui/calendar";

import { RecipePlannerAction } from "@/enums";
import { convertToServerTime, getISOMonth } from "@/lib/time";
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
  const localeForCalendar = useLocale() === "cs" ? cs : enUS;

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState<Date | undefined>(today);
  const [selectedPlanList, setSelectedPlanList] = useState<Plan[] | undefined>(
    initialRecipeListForMonth.data?.filter(
      (day) => day.date === convertToServerTime(today),
    ),
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(
    selectedPlanList ? selectedPlanList[0] : undefined,
  );
  const [planList, setPlanList] = useState(initialRecipeListForMonth.data);

  const handleSelect = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;

    if (date && isSameDay(date, clickedDate)) {
      return;
    }

    setDate(clickedDate);
  };

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);
    setSelectedISOMonth(getISOMonth(newDate));
  };

  useEffect(() => {
    if (!date) return;
    const updatedSelectedPlanList = planList?.filter(
      (day) => day.date === convertToServerTime(date),
    );
    if (updatedSelectedPlanList) {
      setSelectedPlanList(updatedSelectedPlanList);
      setSelectedPlan(updatedSelectedPlanList[0]);
      return;
    }
    setSelectedPlanList(undefined);
    setSelectedPlan(undefined);
  }, [date, planList]);

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
            <Calendar
              mode="single"
              locale={localeForCalendar}
              ISOWeek
              selected={date}
              onSelect={handleSelect}
              events={planList?.map((x) => x.date)}
              className="rounded-md border text-text"
              onMonthChange={(e) => handleMonthChange(e)}
              isLoading={
                recipeListForMonth === undefined &&
                initialISOMonth !== selectedISOMonth
              }
            />
          </div>
          <SelectedDayOverview
            date={date}
            planList={selectedPlanList}
            group={group}
            action={setPopupAction}
          />
        </div>
        <ThisMonthRecipeList
          activeDate={date && convertToServerTime(date)}
          planList={planList}
          clasList="pt-8"
          onItemClick={(date) => setDate(new Date(date))}
        />
      </section>
      <PlannerPopupManager action={popupAction} date={date} />
    </main>
  );
};

export default PlannerPage;
