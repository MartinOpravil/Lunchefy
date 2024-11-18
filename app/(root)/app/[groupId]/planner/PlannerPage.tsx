"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import { enUS, cs } from "date-fns/locale";
import { isSameDay } from "date-fns";
interface Recipe {
  id: string;
  name: string;
}

const PlannerPage = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState<Date | undefined>(today);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );

  const [filledDays, setFilledDays] = useState<Recipe[]>([
    { id: "2024-11-07T23:00:00.000Z", name: "Svíčková na smetaně" },
    { id: "2024-11-11T23:00:00.000Z", name: "Kuře na paprice" },
    { id: "2024-11-13T23:00:00.000Z", name: "Čevapčiči" },
    { id: "2024-11-16T23:00:00.000Z", name: "Bramborový guláš" },
    { id: "2024-11-27T23:00:00.000Z", name: "Svíčková na smetaně" },
    { id: "2024-11-30T23:00:00.000Z", name: "Brambory na smetaně" },
  ]);

  const handleSelect = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;

    if (date && isSameDay(date, clickedDate)) {
      return;
    }

    setDate(clickedDate);
  };

  useEffect(() => {
    const result = filledDays.find((day) => day.id === date?.toISOString());
    setSelectedRecipe(result);
  }, [date, filledDays]);

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2 items-center">
        <Calendar
          mode="single"
          locale={cs}
          ISOWeek
          selected={date}
          onSelect={handleSelect}
          events={filledDays.map((x) => x.id)}
          className="rounded-md border"
        />
        <div className="p-2 bg-accent text-white-1 rounded">
          <div>ISO: {date?.toISOString()}</div>
          <div>Locale: {date?.toLocaleDateString("cs").slice(0, 10)}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          {date?.toLocaleDateString("cs")} -{" "}
          {date?.toLocaleDateString("cs", { weekday: "long" })}
        </div>
        {selectedRecipe ? (
          <>
            <h3>{selectedRecipe.name}</h3>
          </>
        ) : (
          <div>Selected day has no recipe yet.</div>
        )}
      </div>
    </div>
  );
};

export default PlannerPage;
