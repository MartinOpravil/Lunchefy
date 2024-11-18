"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import { enUS, cs } from "date-fns/locale";
import { isSameDay } from "date-fns";
import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { ButtonVariant, HttpResponseCode, Privilage } from "@/enums";
import ActionButton from "@/components/global/ActionButton";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { convertToClientTime, convertToServerTime } from "@/lib/time";
import { getRecipeById } from "@/convex/recipes";
interface Recipe {
  id: string;
  name: string;
}

// interface Plan {
//   id: string;
//   date: string;
//   recipe: Awaited<ReturnType<typeof getRecipeById>>;
// }

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
  const initialMonth = new Date().toISOString().slice(0, 7);

  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipeListForMonth = usePreloadedQuery(
    recipeListForMonthPreloaded
  );

  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const changeRecipeInDate = useMutation(api.planner.changeRecipeInDate);
  const removeRecipeFromDate = useMutation(api.planner.removeRecipeFromDate);

  const recipeListForMonth = useQuery(api.planner.getGroupRecipeListForMonth, {
    groupId: group.data!._id,
    month: initialMonth,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalizedToday = new Date();
  normalizedToday.setUTCHours(0, 0, 0, 0);

  const [date, setDate] = useState<Date | undefined>(today);
  const [normalizedDate, setNormalizedDate] = useState<Date | undefined>(
    normalizedToday
  );
  const [selectedRecipe, setSelectedRecipe] = useState<
    Doc<"recipes"> | undefined
  >(undefined);

  const [filledDays, setFilledDays] = useState<Recipe[]>([
    { id: "2024-11-07T23:00:00.000Z", name: "Svíčková na smetaně" },
    { id: "2024-11-11T23:00:00.000Z", name: "Kuře na paprice" },
    { id: "2024-11-13T23:00:00.000Z", name: "Čevapčiči" },
    { id: "2024-11-16T23:00:00.000Z", name: "Bramborový guláš" },
    { id: "2024-11-27T23:00:00.000Z", name: "Svíčková na smetaně" },
    { id: "2024-11-30T23:00:00.000Z", name: "Brambory na smetaně" },
    { id: "2024-11-21T23:00:00.000Z", name: "Testovací brambory" },
  ]);

  const handleAssignRecipeToDate = async () => {
    // if (!selectedRecipe)
    //   return notifyError("No recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);
    // date.setUTCHours(0, 0, 0, 0);
    try {
      const tryOutId = "jd7fs94aaak8nrzw6gb9h9x3r174kvy4"; // "jd7a0rcsn78ws46as3mfaatjwh74vf3t"
      const result = await assignRecipeToDate({
        groupId: group.data!._id,
        recipeId: tryOutId as Id<"recipes">,
        date: convertToServerTime(date),
      });
      if (!result.data) return notifyError(result.errorMessage!);

      notifySuccess("Recipe successfully assigned to date.");
    } catch (error) {
      notifyError("Error assigning recipe", error?.toString());
    }
  };

  const handleSelect = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;
    // clickedDate.setUTCHours(0, 0, 0, 0);

    if (date && isSameDay(date, clickedDate)) {
      return;
    }

    setDate(clickedDate);
    const normalizedDate = new Date(
      Date.UTC(
        clickedDate.getFullYear(),
        clickedDate.getMonth(),
        clickedDate.getDate()
      )
    );
    setNormalizedDate(normalizedDate);
  };

  useEffect(() => {
    const result = initialRecipeListForMonth.data?.find(
      (day) => day.date === convertToServerTime(date!)
    );
    if (result) return setSelectedRecipe(result.recipe);
    setSelectedRecipe(undefined);
  }, [date, initialRecipeListForMonth]);

  if (!group.data) {
    return <></>;
  }

  return (
    <main className="page pb-8">
      <PageHeader
        title={`${group.data.name} - Planner`}
        icon="recipe_book"
        description={group.data.description}
        actionButton={
          <>
            <LinkButton
              icon={<ArrowLeft />}
              href={`/app/${group.data._id}`}
              variant={ButtonVariant.Dark}
            />
            <div className="bg-accent w-[1.5px] h-6 mx-2 rounded"></div>
            <ActionButton
              icon={<Trash2 />}
              onClick={() => {}}
              variant={ButtonVariant.Negative}
              isDisabled={!selectedRecipe}
            />
            <ActionButton
              icon={<Pencil />}
              onClick={() => {}}
              isDisabled={!selectedRecipe}
            />
            <ActionButton
              title="Add"
              icon={<Plus />}
              onClick={handleAssignRecipeToDate}
              variant={ButtonVariant.Positive}
            />
          </>
        }
      />
      <main className="page-content">
        <div className="flex gap-8 w-full">
          <div className="flex flex-col gap-2 items-center">
            <Calendar
              mode="single"
              locale={cs}
              ISOWeek
              selected={date}
              onSelect={handleSelect}
              events={initialRecipeListForMonth.data?.map((x) => x.date)}
              className="rounded-md border"
              onMonthChange={() => {}}
            />
            <div className="p-2 bg-accent text-white-1 rounded w-full">
              <div>ISO: {date?.toISOString()}</div>
              <div>Locale: {date?.toLocaleDateString("cs").slice(0, 10)}</div>
            </div>
            <div className="p-2 bg-accent text-white-1 rounded w-full">
              <div>Recipes for this month:</div>
              <div className="pt-2">
                {initialRecipeListForMonth.data
                  ?.sort((a, b) => (a.date > b.date ? 1 : -1))
                  .map((plan, index) => {
                    return (
                      <div key={index}>
                        {convertToClientTime(plan.date).toLocaleString("cs", {
                          day: "numeric",
                        })}{" "}
                        - {plan.recipe?.name}
                      </div>
                    );
                  })}
              </div>
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
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedRecipe.ingredients ?? "",
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedRecipe.instructions ?? "",
                  }}
                />
              </>
            ) : (
              <div>Selected day has no recipe yet.</div>
            )}
          </div>
        </div>
      </main>
    </main>
  );
};

export default PlannerPage;
