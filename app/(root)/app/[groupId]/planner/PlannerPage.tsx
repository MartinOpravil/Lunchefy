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
import { ArrowLeft, Pencil, Plus, Replace, Trash2 } from "lucide-react";
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
import BasicDialog from "@/components/global/BasicDialog";
import RecipeSearchInput, {
  RecipeFilterVariant,
} from "@/components/RecipeSearchInput";
import { Option } from "@/components/ui/multiple-selector";
import PlannerRecipeResultList from "@/components/PlannerRecipeResultList";

enum RecipeAction {
  Assign = "assign",
  Swap = "swap",
}

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

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<Option[]>([]);

  const [recipeAction, setRecipeAction] = useState<RecipeAction>(
    RecipeAction.Assign
  );
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [selectedRecipeIdForAction, setSelectedRecipeIdForAction] = useState<
    string | undefined
  >(undefined);

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
    if (!selectedRecipeIdForAction)
      return notifyError("No recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);

    try {
      const result = await assignRecipeToDate({
        groupId: group.data!._id,
        recipeId: selectedRecipeIdForAction as Id<"recipes">,
        date: convertToServerTime(date),
      });
      if (!result.data) return notifyError(result.errorMessage!);

      cleanModifyPopup();
      notifySuccess("Recipe successfully assigned to date.");
    } catch (error) {
      notifyError("Error assigning recipe", error?.toString());
    }
  };
  const handleChangeRecipeInDate = async () => {
    if (!selectedPlan) return notifyError("No plan was selected.", null, 3000);
    if (!selectedRecipeIdForAction)
      return notifyError("No new recipe was selected.", null, 3000);
    if (!date) return notifyError("No date was picked.", null, 3000);

    try {
      const result = await changeRecipeInDate({
        planId: selectedPlan.planId,
        newRecipeId: selectedRecipeIdForAction as Id<"recipes">,
      });
      if (!result.data) return notifyError(result.errorMessage!);

      cleanModifyPopup();
      notifySuccess("Plan successfully updated.");
    } catch (error) {
      notifyError("Error changing plan.", error?.toString());
    }
  };
  const cleanModifyPopup = () => {
    setIsAssignDialogOpen(false);
    setSelectedRecipeIdForAction(undefined);
    setSearchTerm("");
    setSearchTags([]);
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
      setIsRemoveDialogOpen(false);
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

  const handleOpenModifyDialog = (action: RecipeAction) => {
    setRecipeAction(action);
    setIsAssignDialogOpen(true);
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
              onClick={() => setIsRemoveDialogOpen(true)}
              variant={ButtonVariant.Negative}
              isDisabled={!selectedPlan}
            />
            <ActionButton
              icon={<Pencil />}
              onClick={() => handleOpenModifyDialog(RecipeAction.Swap)}
              isDisabled={!selectedPlan}
            />
            <ActionButton
              title="Add"
              icon={<Plus />}
              onClick={() => handleOpenModifyDialog(RecipeAction.Assign)}
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
            {selectedPlanList?.length === 1 && selectedPlan ? (
              <>
                <h3>{selectedPlan?.recipe?.name}</h3>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedPlan?.recipe?.ingredients ?? "",
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: selectedPlan?.recipe?.instructions ?? "",
                  }}
                />
              </>
            ) : (
              <div>Selected day has no recipe yet.</div>
            )}
            {!!selectedPlanList?.length && selectedPlanList.length > 1 && (
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
                      {plan.recipe?.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {selectedPlanList.map((plan, index) => (
                  <TabsContent key={index} value={plan.planId}>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: plan.recipe?.ingredients ?? "",
                      }}
                    />
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: plan.recipe?.instructions ?? "",
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
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
        title="Are you absolutely sure want to remove recipe from date?"
        subject={selectedPlan?.recipe?.name}
        confirmAction={handleRemoveRecipeFromDate}
      />
      <BasicDialog
        isOpen={isAssignDialogOpen}
        setIsOpen={setIsAssignDialogOpen}
        icon={recipeAction === RecipeAction.Assign ? <Plus /> : <Pencil />}
        title={
          recipeAction === RecipeAction.Assign ? "Assign recipe" : "Swap recipe"
        }
        description={
          recipeAction === RecipeAction.Swap ? selectedPlan?.recipe.name : ""
        }
        classList="max-w-[800px]"
        content={
          <div className="flex flex-col items-end gap-4">
            <RecipeSearchInput
              variant={RecipeFilterVariant.Planner}
              group={group}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
            />
            <PlannerRecipeResultList
              groupId={group.data._id}
              privilage={group.data.privilage}
              searchTerm={searchTerm}
              searchTags={searchTags.map((x) => x.value)}
              selectResultAction={setSelectedRecipeIdForAction}
              selectedRecipeId={selectedRecipeIdForAction}
            />
            <ActionButton
              title={recipeAction === RecipeAction.Assign ? "Assign" : "Swap"}
              icon={
                recipeAction === RecipeAction.Assign ? <Plus /> : <Pencil />
              }
              variant={ButtonVariant.Positive}
              onClick={
                recipeAction === RecipeAction.Assign
                  ? handleAssignRecipeToDate
                  : handleChangeRecipeInDate
              }
              isLoading={false}
              isDisabled={!selectedRecipeIdForAction}
            />
          </div>
        }
      />
    </main>
  );
};

export default PlannerPage;
