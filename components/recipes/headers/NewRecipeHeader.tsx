"use client";
import ActionButton from "@/components/global/ActionButton";
import PageHeader from "@/components/global/PageHeader";
import { ButtonVariant } from "@/enums";
import { ArrowLeft, NotebookText, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useFormContext } from "react-hook-form";

interface CustomFormContext {
  performManualLeaveAction: () => void;
}

const NewRecipeHeader = () => {
  const t = useTranslations();
  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    performManualLeaveAction,
  } = useFormContext() as ReturnType<typeof useFormContext> & CustomFormContext;

  return (
    <PageHeader
      title={t("Recipes.General.NewRecipeTitle")}
      icon={<NotebookText className="text-white-1" />}
      leftSide={
        <ActionButton
          icon={<ArrowLeft />}
          onClick={performManualLeaveAction}
          variant={ButtonVariant.Minimalistic}
        />
      }
      rightSide={
        <ActionButton
          title={t("Global.Button.Save")}
          icon={<Save />}
          variant={ButtonVariant.Positive}
          onClick={() => handleSubmit}
          isDisabled={!isDirty}
          isLoading={isSubmitting}
        />
      }
    />
  );
};

export default NewRecipeHeader;
