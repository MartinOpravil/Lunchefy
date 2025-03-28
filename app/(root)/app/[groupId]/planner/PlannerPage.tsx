"use client";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useMemo, useState } from "react";
import { enUS, cs } from "date-fns/locale";
import { isSameDay } from "date-fns";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import PageHeader from "@/components/global/PageHeader";
import LinkButton from "@/components/global/LinkButton";
import {
  ArrowLeft,
  CalendarFold,
  Dot,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ButtonVariant,
  HttpResponseCode,
  PlannerAge,
  Privilage,
  SearchBy,
} from "@/enums";
import ActionButton from "@/components/global/ActionButton";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { Id } from "@/convex/_generated/dataModel";
import {
  convertToClientTime,
  convertToServerTime,
  getISOMonth,
  getPlannerAgeMiliseconds,
} from "@/lib/time";
import { Plan } from "@/types";
import ActionDialog from "@/components/global/ActionDialog";
import BasicDialog from "@/components/global/BasicDialog";
import RecipeSearchInput, {
  RecipeFilterVariant,
} from "@/components/RecipeSearchInput";
import { Option } from "@/components/ui/multiple-selector";
import PlannerRecipeResultList from "@/components/PlannerRecipeResultList";
import { useLocale, useTranslations } from "next-intl";
import Recipe from "@/components/recipes/Recipe";
import { cn } from "@/lib/utils";

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

const currentDate = Date.now();

const PlannerPage = ({
  groupPreloaded,
  recipeListForMonthPreloaded,
}: PlannerPageProps) => {
  const t = useTranslations();
  const initialISOMonth = getISOMonth(new Date());

  const locale = useLocale() === "cs" ? "cs" : "en-GB";
  const localeForCalendar = useLocale() === "cs" ? cs : enUS;

  const group = usePreloadedQuery(groupPreloaded);
  const initialRecipeListForMonth = usePreloadedQuery(
    recipeListForMonthPreloaded
  );

  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const changeRecipeInDate = useMutation(api.planner.changeRecipeInDate);
  const removeRecipeFromDate = useMutation(api.planner.removeRecipeFromDate);

  const [searchBy, setSearchBy] = useState<SearchBy>(SearchBy.Name);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<Option[]>([]);

  const [recipeAction, setRecipeAction] = useState<RecipeAction>(
    RecipeAction.Assign
  );
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedRecipeIdForAction, setSelectedRecipeIdForAction] = useState<
    string | undefined
  >(undefined);

  const [selectedISOMonth, setSelectedISOMonth] = useState(initialISOMonth);
  const recipeListForMonth = useQuery(api.planner.getGroupRecipeListForMonth, {
    groupId: group.data!._id,
    month: selectedISOMonth,
  });

  const [planAge, setPlanAge] = useState<string | undefined>(undefined);
  const recipeListAge = useMemo(() => {
    return getPlannerAgeMiliseconds(currentDate, planAge as PlannerAge);
  }, [planAge]);

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
    setIsActionDialogOpen(false);
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
    setIsActionDialogOpen(true);
  };

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
        {} as Record<string, { date: string; names: string[] }>
      )
    ).sort((a, b) => (a.date > b.date ? 1 : -1));
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
    <main className="page pb-8 page-width-normal">
      <PageHeader
        title={t("Groups.Planner.Title")}
        icon={<CalendarFold className="text-white-1" />}
        leftSide={
          <LinkButton
            icon={<ArrowLeft />}
            href={`/app/${group.data._id}`}
            variant={ButtonVariant.Minimalistic}
          />
        }
        rightSide={
          <>
            <ActionButton
              title={t("Groups.Planner.Button.Assign")}
              icon={<Plus />}
              onClick={() => handleOpenModifyDialog(RecipeAction.Assign)}
              variant={ButtonVariant.Positive}
            />
          </>
        }
      />
      <section className="page-content">
        <div className="flex gap-8 w-full relative flex-col sm:flex-row min-h-[450px]">
          <div className="flex flex-col gap-8 items-center">
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
          <div className="flex flex-col gap-8 w-full @container">
            <span>
              <h2 className="capitalize">
                {date?.toLocaleDateString(locale, {
                  weekday: "long",
                })}
              </h2>
              <span className="text-text2">{`(${date?.toLocaleDateString(locale)})`}</span>
            </span>
            {selectedPlanList?.map((plan, index) => (
              <div
                key={index}
                className="w-full flex flex-col @sm:flex-row gap-2"
              >
                <Recipe
                  recipe={plan.recipe}
                  privilage={Privilage.Viewer}
                  vertical
                  useVerticalButton
                  classList="w-full flex-shrink-0 @sm:flex-shrink"
                />
                <div className="flex flex-row @sm:flex-col gap-2 h-full justify-end @sm:justify-start flex-shrink">
                  <ActionButton
                    icon={<Pencil />}
                    onClick={() => {
                      setSelectedPlan(
                        selectedPlanList.find((x) => x.planId === plan.planId)
                      );
                      handleOpenModifyDialog(RecipeAction.Swap);
                    }}
                    isDisabled={!selectedPlan}
                  />
                  <ActionButton
                    icon={
                      <Trash2 className="group-hover:text-primary transition-all" />
                    }
                    onClick={() => {
                      setSelectedPlan(
                        selectedPlanList.find((x) => x.planId === plan.planId)
                      );
                      setIsRemoveDialogOpen(true);
                    }}
                    isDisabled={!selectedPlan}
                  />
                </div>
              </div>
            ))}
            {selectedPlanList?.length === 0 && (
              <div className="text-[16px] sm:text-[20px] italic text-text2">
                {t("Groups.Planner.SelectedDateNoRecipe")}
              </div>
            )}
          </div>
        </div>
        <ThisMonthRecipeList
          activeDate={date && convertToServerTime(date)}
          planList={planList}
          locale={locale}
          clasList="pt-8"
          onItemClick={(date) => setDate(new Date(date))}
        />
      </section>
      <ActionDialog
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
        title={t("Groups.Planner.Action.DeleteRecipeTitle")}
        subject={selectedPlan?.recipe?.name}
        confirmAction={handleRemoveRecipeFromDate}
        confirmButtonLabel={t("Groups.Planner.Button.Remove")}
      />
      <BasicDialog
        isOpen={isActionDialogOpen}
        setIsOpen={setIsActionDialogOpen}
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
              searchBy={searchBy}
              setSearchBy={setSearchBy}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchTags={searchTags}
              setSearchTags={setSearchTags}
              plannerAge={planAge}
              setPlannerAge={setPlanAge}
            />
            <PlannerRecipeResultList
              groupId={group.data._id}
              privilage={group.data.privilage}
              searchTerm={searchTerm}
              searchTags={searchTags.map((x) => x.value)}
              selectResultAction={setSelectedRecipeIdForAction}
              selectedRecipeId={selectedRecipeIdForAction}
              dateMiliseconds={recipeListAge}
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

interface ThisMonthRecipeListProps {
  activeDate?: string;
  planList: Plan[] | null;
  locale: string;
  clasList?: string;
  onItemClick: (date: string) => void;
}

const ThisMonthRecipeList = ({
  activeDate,
  planList,
  locale,
  clasList,
  onItemClick,
}: ThisMonthRecipeListProps) => {
  const t = useTranslations();

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
        {} as Record<string, { date: string; names: string[] }>
      )
    ).sort((a, b) => (a.date > b.date ? 1 : -1));
  };

  return (
    <div className={cn("w-full @container", clasList)}>
      <h3 className="text-[20px] sm:text-[24px]">
        {t("Groups.Planner.RecipeListTitle")}
      </h3>
      <div className="pt-8 columns-1 @sm:columns-2 @lg:columns-3 @2xl:columns-4 gap-4">
        {planList &&
          getGroupedData(planList)?.map((plan, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "transition-all flex flex-col gap-3 px-2 py-4 mb-4 rounded-lg break-inside-avoid outline-1 outline outline-accent cursor-pointer hover:outline-primary",
                  {
                    "text-primary": activeDate === plan.date,
                  }
                )}
                onClick={() => onItemClick(plan.date)}
              >
                <div
                  className={cn("w-full text-text2 text-[18px] text-center", {
                    "text-primary": activeDate === plan.date,
                  })}
                >
                  {convertToClientTime(plan.date).toLocaleString(locale, {
                    day: "numeric",
                  })}
                </div>
                <div className="heading-underline !my-0" />
                <div className="flex flex-col text-[14px] sm:text-[16px] justify-between gap-2">
                  {plan.names.map((name, i) => (
                    <div key={i} className="flex items-center gap-1 text-text">
                      <Dot className="!min-w-6 !h-6" />
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

export default PlannerPage;
