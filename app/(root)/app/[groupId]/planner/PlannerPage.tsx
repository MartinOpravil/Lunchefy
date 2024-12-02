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
import { ButtonVariant, HttpResponseCode } from "@/enums";
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
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
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
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000
      );

    try {
      const result = await assignRecipeToDate({
        groupId: group.data!._id,
        recipeId: selectedRecipeIdForAction as Id<"recipes">,
        date: convertToServerTime(date),
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.Conflict:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign409")
            );
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign500")
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      cleanModifyPopup();
      notifySuccess(t("Groups.Planner.Notification.Success.Assign"));
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Assign"),
        error?.toString()
      );
    }
  };
  const handleChangeRecipeInDate = async () => {
    if (!selectedPlan)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoPlanSelected"),
        null,
        3000
      );
    if (!selectedRecipeIdForAction)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000
      );

    try {
      const result = await changeRecipeInDate({
        planId: selectedPlan.planId,
        newRecipeId: selectedRecipeIdForAction as Id<"recipes">,
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.Planner.Notification.Error.Update404")
            );
          case HttpResponseCode.BadRequest:
          case HttpResponseCode.Conflict:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign409")
            );

          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      cleanModifyPopup();
      notifySuccess(t("Groups.Planner.Notification.Success.Swap"));
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Swap"),
        error?.toString()
      );
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
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000
      );

    try {
      const result = await removeRecipeFromDate({
        planId: selectedPlan.planId,
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.Planner.Notification.Error.Delete404")
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Groups.Planner.Notification.Success.Remove"));
      setIsRemoveDialogOpen(false);
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Remove"),
        error?.toString()
      );
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
        title={`${group.data.name} - ${t("Groups.Planner.Title")}`}
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
              title={t("Groups.Planner.Button.Assign")}
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
              <div className="text-accent">
                {t("Groups.Planner.RecipeListTitle")}
              </div>
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
              <div>{t("Groups.Planner.SelectedDateNoRecipe")}</div>
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
        title={t("Groups.Planner.Action.DeleteRecipeTitle")}
        subject={selectedPlan?.recipe?.name}
        confirmAction={handleRemoveRecipeFromDate}
        confirmButtonLabel={t("Groups.Planner.Button.Remove")}
      />
      <BasicDialog
        isOpen={isAssignDialogOpen}
        setIsOpen={setIsAssignDialogOpen}
        icon={recipeAction === RecipeAction.Assign ? <Plus /> : <Pencil />}
        title={
          recipeAction === RecipeAction.Assign
            ? t("Groups.Planner.Action.AssignRecipeTitle")
            : t("Groups.Planner.Action.SwapRecipeTitle")
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
              title={
                recipeAction === RecipeAction.Assign
                  ? t("Groups.Planner.Button.Assign")
                  : t("Groups.Planner.Button.Swap")
              }
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
