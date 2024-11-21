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
import { ButtonVariant } from "@/enums";
import ActionButton from "@/components/global/ActionButton";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { Id } from "@/convex/_generated/dataModel";
import {
  convertToClientTime,
  convertToServerTime,
  getISOMonth,
} from "@/lib/time";
import LoaderSpinner from "@/components/global/LoaderSpinner";
import { Plan } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActionDialog from "@/components/global/ActionDialog";

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
    recipeListForMonthPreloaded
  );

  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const changeRecipeInDate = useMutation(api.planner.changeRecipeInDate);
  const removeRecipeFromDate = useMutation(api.planner.removeRecipeFromDate);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      (day) => day.date === convertToServerTime(today)
    )
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(
    selectedPlanList ? selectedPlanList[0] : undefined
  );
  const [planList, setPlanList] = useState(initialRecipeListForMonth.data);

  const handleAssignRecipeToDate = async () => {
    // if (!selectedRecipe)
    //   return notifyError("No recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);

    try {
      const tryOutId = "jd7fs94aaak8nrzw6gb9h9x3r174kvy4";
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
  const handleChangeRecipeInDate = async () => {
    if (!selectedPlan)
      return notifyError("No recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);

    try {
      const tryOutId = "jd7a0rcsn78ws46as3mfaatjwh74vf3t";
      const result = await changeRecipeInDate({
        planId: selectedPlan.planId,
        newRecipeId: tryOutId as Id<"recipes">,
      });

      if (!result.data) return notifyError(result.errorMessage!);

      notifySuccess("Plan successfully updated.");
    } catch (error) {
      notifyError("Error changing plan.", error?.toString());
    }
  };
  const handleRemoveRecipeFromDate = async () => {
    if (!selectedPlan)
      return notifyError("No recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);

    try {
      const result = await removeRecipeFromDate({
        planId: selectedPlan.planId,
      });
      // selectedRecipe.pl
      if (!result.data) return notifyError(result.errorMessage!);

      notifySuccess("Recipe successfully removed from date.");
      setIsDialogOpen(false);
    } catch (error) {
      notifyError("Error removing recipe", error?.toString());
    }
  };

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
      (day) => day.date === convertToServerTime(date)
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
              onClick={() => setIsDialogOpen(true)}
              variant={ButtonVariant.Negative}
              isDisabled={!selectedPlan}
            />
            <ActionButton
              icon={<Pencil />}
              onClick={handleChangeRecipeInDate}
              isDisabled={!selectedPlan}
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
        <div className="flex gap-8 w-full relative flex-col sm:flex-row">
          <div className="flex flex-col gap-2 items-center">
            <Calendar
              mode="single"
              locale={cs}
              ISOWeek
              selected={date}
              onSelect={handleSelect}
              events={planList?.map((x) => x.date)}
              className="rounded-md border"
              onMonthChange={(e) => handleMonthChange(e)}
            />
            <div className="p-2 rounded w-full">
              <div className="text-accent">Recipes for this month:</div>
              <div className="pt-2">
                {planList?.map((plan, index) => {
                  return (
                    <div key={index} className="flex gap-2">
                      <div className="w-6 text-accent">
                        {convertToClientTime(plan.date).toLocaleString("cs", {
                          day: "numeric",
                        })}
                      </div>
                      <div>{plan.recipe?.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {recipeListForMonth === undefined &&
              initialISOMonth !== selectedISOMonth && (
                <div className="absolute top-0 right-0 w-10">
                  <LoaderSpinner size={15} />
                </div>
              )}
            <div>
              {date?.toLocaleDateString("cs")} -{" "}
              {date?.toLocaleDateString("cs", { weekday: "long" })}
            </div>
            {selectedPlan ? (
              <>
                <h3>{selectedPlan.recipe.name}</h3>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedPlan.recipe.ingredients ?? "",
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedPlan.recipe.instructions ?? "",
                  }}
                />
              </>
            ) : (
              <div>Selected day has no recipe yet.</div>
            )}
            {!!selectedPlanList?.length && (
              <Tabs value={selectedPlan?.planId} className="p-3 rounded">
                <TabsList className="flex flex-col sm:flex-row gap-2">
                  {selectedPlanList.map((plan, index) => (
                    <TabsTrigger
                      key={index}
                      value={plan.planId}
                      className="flex gap-2"
                      onClick={() => {
                        setSelectedPlan(
                          selectedPlanList.find((x) => x.planId === plan.planId)
                        );
                      }}
                    >
                      {plan.recipe.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {selectedPlanList.map((plan, index) => (
                  <TabsContent key={index} value={plan.planId}>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: plan.recipe.ingredients ?? "",
                      }}
                    />
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: plan.recipe.instructions ?? "",
                      }}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <ActionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Are you absolutely sure want to remove recipe from date?"
        subject={selectedPlan?.recipe.name}
        confirmAction={handleRemoveRecipeFromDate}
      />
    </main>
  );
};

export default PlannerPage;
