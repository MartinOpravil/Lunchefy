"use client";
import React, { useState } from "react";
import ActionButton from "../global/ActionButton";
import { CalendarPlus } from "lucide-react";
import { ButtonVariant, HttpResponseCode } from "@/enums";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericId } from "convex/values";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { Id } from "@/convex/_generated/dataModel";
import { convertToServerTime } from "@/lib/time";
import { useTranslations } from "next-intl";

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
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!recipeId)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000
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

      notifySuccess(t("Groups.Planner.Notification.Success.Assign"));
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Assign"),
        error?.toString()
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
