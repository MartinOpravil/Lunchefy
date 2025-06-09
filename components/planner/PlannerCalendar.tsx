import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useLocale } from "next-intl";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { isSameDay } from "date-fns";
import { cs, enUS } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";

import { getISOMonth } from "@/lib/time";
import { Plan } from "@/types";

interface PlannerCalendarProps {
  groupId: string;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  onSelect?: () => void;
  onMonthChange?: (newDate: Date) => void;
  initialPlanList?: Plan[];
}

const PlannerCalendar = ({
  groupId,
  selectedDate,
  setSelectedDate,
  onSelect,
  onMonthChange,
  initialPlanList,
}: PlannerCalendarProps) => {
  const localeForCalendar = useLocale() === "cs" ? cs : enUS;
  const initialISOMonth = getISOMonth(new Date());

  const [selectedISOMonth, setSelectedISOMonth] = useState(initialISOMonth);
  const planListForMonth = useQuery(api.planner.getGroupRecipeListForMonth, {
    groupId: groupId,
    month: selectedISOMonth,
  });

  const [planList, setPlanList] = useState(initialPlanList);

  useEffect(() => {
    if (planListForMonth?.data) {
      setPlanList(planListForMonth.data);
    }
  }, [planListForMonth]);

  const handleMonthChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setSelectedISOMonth(getISOMonth(newDate));
    if (onMonthChange) onMonthChange(newDate);
  };

  const handleSelect = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;
    if (selectedDate && isSameDay(selectedDate, clickedDate)) {
      return;
    }
    setSelectedDate(clickedDate);
    if (onSelect) onSelect();
  };

  return (
    <Calendar
      mode="single"
      locale={localeForCalendar}
      ISOWeek
      selected={selectedDate}
      onSelect={handleSelect}
      className="w-fit rounded-md border text-text"
      onMonthChange={(e) => handleMonthChange(e)}
      events={planList?.map((x) => x.date)}
      isLoading={planListForMonth === undefined}
    />
  );
};

export default PlannerCalendar;
