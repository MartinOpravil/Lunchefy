import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pencil, Plus } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import ActionDialog from "@/components/global/dialog/ActionDialog";
import BasicDialog from "@/components/global/dialog/BasicDialog";
import PlannerRecipeResultList from "@/components/planner/search/PlannerRecipeResultList";
import RecipeSearchInput, {
  RecipeFilterVariant,
} from "@/components/recipe/search/RecipeSearchInput";
import { Option } from "@/components/ui/multiple-selector";

import {
  ButtonVariant,
  HttpResponseCode,
  PlannerAge,
  RecipePlannerAction,
  SearchBy,
} from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { convertToServerTime, getPlannerAgeMiliseconds } from "@/lib/time";
import { PlannerAction } from "@/types";

interface PlannerPopupManagerProps {
  action: PlannerAction | null;
  date?: Date;
}

const currentDate = Date.now();

const PlannerPopupManager = ({ action, date }: PlannerPopupManagerProps) => {
  const t = useTranslations();

  const [searchBy, setSearchBy] = useState<SearchBy>(SearchBy.Name);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<Option[]>([]);
  const [planAge, setPlanAge] = useState<string | undefined>(undefined);

  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const changeRecipeInDate = useMutation(api.planner.changeRecipeInDate);
  const removeRecipeFromDate = useMutation(api.planner.removeRecipeFromDate);

  const [selectedRecipeIdForAction, setSelectedRecipeIdForAction] = useState<
    string | undefined
  >(undefined);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const recipeListAge = useMemo(() => {
    return getPlannerAgeMiliseconds(currentDate, planAge as PlannerAge);
  }, [planAge]);

  useEffect(() => {
    if (action) setIsDialogOpen(true);
  }, [action]);

  const handleAssignRecipeToDate = async () => {
    if (action?.type !== RecipePlannerAction.Assign) return;

    if (!selectedRecipeIdForAction)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000,
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000,
      );

    try {
      const result = await assignRecipeToDate({
        groupId: action.group.data!._id,
        recipeId: selectedRecipeIdForAction as Id<"recipes">,
        date: convertToServerTime(date),
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.Conflict:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign409"),
            );
          case HttpResponseCode.InternalServerError:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign500"),
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
        error?.toString(),
      );
    }
  };
  const handleChangeRecipeInDate = async () => {
    if (!action?.plan)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoPlanSelected"),
        null,
        3000,
      );
    if (!selectedRecipeIdForAction)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000,
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000,
      );

    try {
      const result = await changeRecipeInDate({
        planId: action?.plan.planId,
        newRecipeId: selectedRecipeIdForAction as Id<"recipes">,
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.Planner.Notification.Error.Update404"),
            );
          case HttpResponseCode.BadRequest:
          case HttpResponseCode.Conflict:
            return notifyError(
              t("Groups.Planner.Notification.Error.Assign409"),
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
        error?.toString(),
      );
    }
  };
  const handleRemoveRecipeFromDate = async () => {
    if (!action?.plan)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000,
      );
    if (!date)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoDatePicked"),
        null,
        3000,
      );

    try {
      const result = await removeRecipeFromDate({
        planId: action.plan.planId,
      });
      if (!result.data) {
        switch (result.status) {
          case HttpResponseCode.NotFound:
            return notifyError(
              t("Groups.Planner.Notification.Error.Delete404"),
            );
          default:
            return notifyError(t("Global.Notification.UnexpectedError"));
        }
      }

      notifySuccess(t("Groups.Planner.Notification.Success.Remove"));
      setIsDialogOpen(false);
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Remove"),
        error?.toString(),
      );
    }
  };
  const cleanModifyPopup = () => {
    setIsDialogOpen(false);
    setSearchTerm("");
    setSearchTags([]);
  };

  if (!action) return <></>;

  switch (action.type) {
    case RecipePlannerAction.Remove:
      return (
        <ActionDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          title={t("Groups.Planner.Action.DeleteRecipeTitle")}
          subject={action.plan?.recipe?.name}
          confirmAction={handleRemoveRecipeFromDate}
          confirmButtonLabel={t("Groups.Planner.Button.Remove")}
        />
      );
    case RecipePlannerAction.Assign:
    case RecipePlannerAction.Swap:
    default:
      if (!action.group.data) return <></>;
      return (
        <BasicDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          icon={
            action.type === RecipePlannerAction.Assign ? <Plus /> : <Pencil />
          }
          title={
            action.type === RecipePlannerAction.Assign
              ? t("Groups.Planner.Action.AssignRecipeTitle")
              : t("Groups.Planner.Action.SwapRecipeTitle")
          }
          description={
            action.type === RecipePlannerAction.Swap
              ? action.plan?.recipe.name
              : ""
          }
          classList="max-w-[800px]"
          content={
            <div className="flex flex-col items-end gap-4">
              <RecipeSearchInput
                variant={RecipeFilterVariant.Planner}
                group={action.group}
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
                groupId={action.group.data._id}
                searchTerm={searchTerm}
                searchTags={searchTags.map((x) => x.value)}
                selectRecipeIdForAction={setSelectedRecipeIdForAction}
                selectedRecipeId={selectedRecipeIdForAction}
                dateMiliseconds={recipeListAge}
              />
              <ActionButton
                title={
                  action.type === RecipePlannerAction.Assign
                    ? t("Groups.Planner.Button.Assign")
                    : t("Groups.Planner.Button.Swap")
                }
                icon={
                  action.type === RecipePlannerAction.Assign ? (
                    <Plus />
                  ) : (
                    <Pencil />
                  )
                }
                variant={ButtonVariant.Positive}
                onClick={
                  action.type === RecipePlannerAction.Assign
                    ? handleAssignRecipeToDate
                    : handleChangeRecipeInDate
                }
                isLoading={false}
                isDisabled={!selectedRecipeIdForAction}
              />
            </div>
          }
        />
      );
  }
};

export default PlannerPopupManager;
