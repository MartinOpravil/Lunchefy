"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { GenericId } from "convex/values";
import { CalendarPlus } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import BasicDialog from "@/components/global/dialog/BasicDialog";
import ChosenImage from "@/components/global/image/ChosenImage";
import PlannerCalendar from "@/components/planner/PlannerCalendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ButtonVariant, HttpResponseCode } from "@/enums";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { convertToServerTime, getCleanDate } from "@/lib/time";

interface AssignRecipeToTodayPlanButtonProps {
  recipe: Doc<"recipes">;
  isCardVariant?: boolean;
}

const AssignRecipeToDatePlanButton = ({
  recipe,
  isCardVariant = false,
}: AssignRecipeToTodayPlanButtonProps) => {
  const t = useTranslations();
  const assignRecipeToDate = useMutation(api.planner.assignRecipeToDate);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    getCleanDate(new Date()),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssignRecipeToDate = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!recipe._id)
      return notifyError(
        t("Groups.Planner.Notification.Error.NoRecipeSelected"),
        null,
        3000,
      );
    if (!selectedDate) return console.log("No date selected for assignment");

    try {
      setIsLoading(true);
      const result = await assignRecipeToDate({
        groupId: recipe.groupId,
        recipeId: recipe._id as Id<"recipes">,
        date: convertToServerTime(selectedDate),
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
      setIsDialogOpen(false);
    } catch (error) {
      notifyError(
        t("Groups.Planner.Notification.Error.Assign"),
        error?.toString(),
      );
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ActionButton
        icon={<CalendarPlus />}
        variant={ButtonVariant.Minimalistic}
        classList={
          isCardVariant
            ? "pointer-events-auto opacity opacity-60 group-hover:opacity-80 hover:!opacity-100 ml-auto"
            : ""
        }
        isLoading={isLoading}
        onClick={() => setIsDialogOpen(true)}
      />
      <BasicDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title={t("Groups.Planner.Action.AssignRecipeTitle")}
        description={recipe.name}
        classList="min-w-[380px] max-w-fit"
        content={
          <div className="flex flex-col items-center justify-center gap-4">
            <ScrollArea className="max-h-[calc(100vh-14rem)]">
              <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-[320px_320px]">
                <ChosenImage
                  image={recipe.coverImage}
                  classList="h-[150px] md:h-full rounded-xl bg-accent/30"
                />
                <PlannerCalendar
                  groupId={recipe.groupId}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
            </ScrollArea>

            <div className="flex flex-col gap-2">
              <ActionButton
                icon={<CalendarPlus />}
                variant={ButtonVariant.Positive}
                title={t("Groups.Planner.Action.AssignRecipeTitle")}
                isLoading={isLoading}
                onClick={handleAssignRecipeToDate}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default AssignRecipeToDatePlanButton;
