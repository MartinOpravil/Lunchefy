"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { CalendarPlus } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";

import { ButtonVariant, HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { convertToServerTime } from "@/lib/time";

interface AssignRecipeToTodayPlanButtonProps {
  recipeId: GenericId<"recipes">;
  groupId: GenericId<"groups">;
  isCardVariant?: boolean;
}

const AssignRecipeToTodayPlanButton = ({
  recipeId,
  groupId,
  isCardVariant = false,
}: AssignRecipeToTodayPlanButtonProps) => {
  const t = useTranslations();
  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignRecipeToDate = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!recipeId)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000,
      );

    try {
      setIsLoading(true);
      const date = new Date();
      const result = await assignRecipeToDate({
        groupId,
        recipeId: recipeId as Id<"recipes">,
        date: convertToServerTime(date),
      });
      setIsLoading(false);
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

      notifySuccess(t("Groups.Planner.Notification.Success.Assign"));
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Assign"),
        error?.toString(),
      );
      setIsLoading(false);
    }
  };

  return (
    <ActionButton
      icon={<CalendarPlus />}
      variant={ButtonVariant.Minimalistic}
      classList={
        isCardVariant
          ? "pointer-events-auto opacity opacity-60 group-hover:opacity-80 hover:!opacity-100 ml-auto"
          : ""
      }
      isLoading={isLoading}
      onClick={handleAssignRecipeToDate}
    />
  );
};

export default AssignRecipeToTodayPlanButton;
